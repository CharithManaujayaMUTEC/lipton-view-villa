"use client";

/** Plays a direct video file, or embeds YouTube/Vimeo links. */
export function VideoPlayer({ url, poster }: { url: string; poster?: string }) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  const embed = yt
    ? `https://www.youtube.com/embed/${yt[1]}?autoplay=1`
    : vimeo
      ? `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`
      : null;
  if (embed)
    return (
      <iframe
        src={embed}
        className="aspect-video w-full rounded-xl"
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Video"
      />
    );
  return <video src={url} poster={poster} controls autoPlay className="aspect-video w-full rounded-xl bg-black" />;
}
