import { getYouTubeVideoId } from "@/lib/blog";

export default function BlogVideoEmbed({ videoUrl, title }: { videoUrl: string; title: string }) {
  const videoId = getYouTubeVideoId(videoUrl);

  // If the URL doesn't look like a valid YouTube link, don't render a
  // broken embed — the caller falls back to the photo/placeholder instead.
  if (!videoId) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}