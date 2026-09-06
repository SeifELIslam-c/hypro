import { useEffect, useRef, useState, useCallback } from "react";
import { Maximize2, Minimize2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DirectVideoPreviewProps {
  youtubeId?: string;
  videoUrl?: string;
  poster?: string;
  title: string;
  className?: string;
  aspectRatio?: string;
  isPlaying?: boolean;
}

export function DirectVideoPreview({
  youtubeId,
  videoUrl,
  poster,
  title,
  className,
  aspectRatio = "aspect-[16/10]",
  isPlaying = false,
}: DirectVideoPreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [manualState, setManualState] = useState<boolean | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // When parent isPlaying changes via scroll, clear manual override
  useEffect(() => {
    setManualState(null);
  }, [isPlaying]);

  const effectivePlaying = manualState !== null ? manualState : isPlaying;

  // Extract youtube ID if not provided explicitly
  const resolvedYtId =
    youtubeId ||
    (videoUrl?.includes("youtube.com/watch?v=")
      ? videoUrl.split("v=")[1]?.split("&")[0]
      : videoUrl?.includes("youtu.be/")
        ? videoUrl.split("youtu.be/")[1]?.split("?")[0]
        : undefined);

  useEffect(() => {
    // Mobile / SSR safety fallback: ensure loading spinner disappears quickly
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Synchronize playing state with YouTube iframe or HTML5 video
  useEffect(() => {
    if (!isLoaded) return;
    if (resolvedYtId && iframeRef.current?.contentWindow) {
      const func = effectivePlaying ? "playVideo" : "pauseVideo";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func, args: "" }),
        "*",
      );
    } else if (videoRef.current) {
      if (effectivePlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [effectivePlaying, isLoaded, resolvedYtId]);

  const handleIframeLoad = () => {
    setIsLoaded(true);
    if (!effectivePlaying && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
        "*",
      );
    }
  };

  // Toggle Play / Pause by button or clicking video
  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoaded(true);
    const next = !effectivePlaying;
    setManualState(next);
    if (resolvedYtId && iframeRef.current?.contentWindow) {
      const func = next ? "playVideo" : "pauseVideo";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func, args: "" }),
        "*",
      );
    } else if (videoRef.current) {
      if (next) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Toggle Mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (resolvedYtId && iframeRef.current?.contentWindow) {
      const command = isMuted
        ? '{"event":"command","func":"unMute","args":""}'
        : '{"event":"command","func":"mute","args":""}';
      iframeRef.current.contentWindow.postMessage(command, "*");
      setIsMuted(!isMuted);
    } else if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // True native fullscreen that preserves the EXACT playback moment
  const toggleFullscreen = useCallback(async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement && !(document as unknown as { webkitFullscreenElement: Element | null }).webkitFullscreenElement) {
      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if ((el as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen) {
          await (el as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch {
        setIsFullscreen(true);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
        }
      } catch {}
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      const isNativeFs =
        !!document.fullscreenElement ||
        !!(document as unknown as { webkitFullscreenElement: Element | null }).webkitFullscreenElement;
      setIsFullscreen(isNativeFs);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
      window.removeEventListener("keydown", onKey);
    };
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative overflow-hidden bg-charcoal transition-all duration-500 select-none",
        isFullscreen
          ? "fixed inset-0 z-[120] size-full rounded-none"
          : cn("rounded-[1.5rem] md:rounded-[2rem]", aspectRatio),
        className,
      )}
    >
      {/* VIDEO CONTAINER — REMAINS CONTINUOUSLY MOUNTED FOR EXACT MOMENT SYNC */}
      <div className="absolute inset-0 size-full overflow-hidden">
        {resolvedYtId ? (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${resolvedYtId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${resolvedYtId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`}
            title={`${title} — Vidéo 3D`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={handleIframeLoad}
            className={cn(
              "pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[142%] h-[142%] border-0 object-cover transition-opacity duration-1000 ease-out",
              isLoaded ? "opacity-100" : "opacity-0",
            )}
          />
        ) : videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onPlaying={() => setIsLoaded(true)}
            className={cn(
              "size-full object-cover transition-opacity duration-1000 ease-out",
              isLoaded ? "opacity-100" : "opacity-0",
            )}
          />
        ) : poster ? (
          <img src={poster} alt={title} className="size-full object-cover" loading="lazy" />
        ) : null}
      </div>

      {/* CLICKABLE OVERLAY TO PLAY / PAUSE ON TAP */}
      <div
        onClick={togglePlayPause}
        className="absolute inset-0 z-10 cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={effectivePlaying ? "Mettre en pause" : "Lire la vidéo"}
      />

      {/* LUXURY ARCHITECTURAL LOADER */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-charcoal transition-opacity duration-700",
          isLoaded ? "opacity-0" : "opacity-100",
        )}
      >
        {poster && (
          <img
            src={poster}
            alt={title}
            className="absolute inset-0 size-full object-cover opacity-40"
          />
        )}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <svg
            className="h-12 w-12 text-gold/80"
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15 110 V55 A35 35 0 0 1 85 55 V110" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M30 110 V60 A20 20 0 0 1 70 60 V110"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.6"
            />
            <circle cx="50" cy="24" r="4" fill="currentColor" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* AMBIENT GRADIENT */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-charcoal/20" />

      {/* CENTER PLAY BADGE WHEN PAUSED */}
      {!effectivePlaying && isLoaded && (
        <div
          onClick={togglePlayPause}
          className="pointer-events-none absolute inset-0 z-15 flex items-center justify-center animate-fade-in"
        >
          <span className="flex size-14 items-center justify-center rounded-full border border-gold/40 bg-charcoal/80 text-gold backdrop-blur-md transition-transform hover:scale-110 shadow-2xl">
            <Play className="size-6 fill-current translate-x-0.5" />
          </span>
        </div>
      )}



      {/* CONTROLS (PLAY/PAUSE, AUDIO, FULLSCREEN) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        {/* PLAY / PAUSE BUTTON */}
        <button
          type="button"
          onClick={togglePlayPause}
          aria-label={effectivePlaying ? "Mettre en pause" : "Lire la vidéo"}
          className="flex size-9 items-center justify-center rounded-full border border-charcoal-foreground/20 bg-charcoal/70 text-charcoal-foreground backdrop-blur-md transition-all hover:bg-gold hover:text-charcoal hover:scale-105"
        >
          {effectivePlaying ? (
            <Pause className="size-3.5 fill-current" />
          ) : (
            <Play className="size-3.5 fill-current translate-x-0.5" />
          )}
        </button>

        {/* AUDIO MUTE / UNMUTE BUTTON */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Activer le son" : "Couper le son"}
          className="flex size-9 items-center justify-center rounded-full border border-charcoal-foreground/20 bg-charcoal/70 text-charcoal-foreground backdrop-blur-md transition-all hover:bg-gold hover:text-charcoal hover:scale-105"
        >
          {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
        </button>

        {/* FULLSCREEN BUTTON */}
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          className="flex size-9 items-center justify-center rounded-full border border-charcoal-foreground/20 bg-charcoal/70 text-charcoal-foreground backdrop-blur-md transition-all hover:bg-gold hover:text-charcoal hover:scale-105"
        >
          {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
        </button>
      </div>

      {/* CLOSE BUTTON WHEN IN FULLSCREEN */}
      {isFullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label="Fermer le plein écran"
          className="absolute top-6 right-6 z-30 flex size-11 items-center justify-center rounded-full bg-charcoal/85 text-white backdrop-blur-md transition-all hover:bg-gold hover:text-charcoal hover:scale-105 shadow-2xl"
        >
          <X className="size-5" />
        </button>
      )}
    </div>
  );
}
