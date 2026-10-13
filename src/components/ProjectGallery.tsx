import { useCallback, useState } from "react";
import { MediaLightbox } from "@/components/MediaLightbox";

type Props = {
  title: string;
  images: string[];
};

export function ProjectGallery({ title, images }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const previous = useCallback(() => {
    setActive((index) => (index === null ? null : (index - 1 + images.length) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setActive((index) => (index === null ? null : (index + 1) % images.length));
  }, [images.length]);

  return (
    <>
      <section
        aria-label={`${title} gallery`}
        className="mx-auto max-w-[1600px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
      >
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Enlarge ${title} — still ${index + 1}`}
            aria-haspopup="dialog"
            className="block w-full self-start cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            <img
              src={image}
              alt={`${title} — still ${index + 1}`}
              loading="lazy"
              className="w-full h-auto"
            />
          </button>
        ))}
      </section>
      {active !== null ? (
        <MediaLightbox
          item={{ type: "image", src: images[active], title: `${title} — still ${active + 1}` }}
          onClose={close}
          onPrevious={images.length > 1 ? previous : undefined}
          onNext={images.length > 1 ? next : undefined}
          position={`${active + 1} / ${images.length}`}
        />
      ) : null}
    </>
  );
}
