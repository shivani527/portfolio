"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import portfolioItems from "@/data/portfolios.json";

type Project = (typeof portfolioItems)[number];

function ProjectDialog({
  index,
  onIndex,
  onClose,
}: {
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const titleId = useId();
  const total = portfolioItems.length;
  const item: Project = portfolioItems[index];

  useEffect(() => {
    if (ref.current && !ref.current.open) ref.current.showModal();
  }, []);

  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      ref.current?.close();
      onClose();
    }, 220);
  }, [closing, onClose]);

  const go = (delta: number) => onIndex((index + delta + total) % total);
  const prev = portfolioItems[(index - 1 + total) % total];
  const next = portfolioItems[(index + 1) % total];

  return (
    <dialog
      ref={ref}
      className={`project-dialog${closing ? " is-closing" : ""}`}
      aria-labelledby={titleId}
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) requestClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <div className="project-dialog__shell">
        <button
          type="button"
          className="project-dialog__close"
          aria-label="Close project details"
          onClick={requestClose}
        >
          ×
        </button>

        <div className="project-dialog__media">
          <Image
            key={item.src}
            className="project-dialog__img"
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes="(max-width: 900px) 92vw, 640px"
          />
        </div>

        <div className="project-dialog__info">
          <p className="small project-dialog__count">
            Project {index + 1} of {total}
          </p>
          <div className="card__tags d-flex flex-wrap">
            {item.tags.map((tag) => (
              <span key={tag.text} className="rounded-tag tech-badge">
                {tag.text}
              </span>
            ))}
          </div>
          <h3 id={titleId} className="project-dialog__title">
            {item.title}
          </h3>
          <p className="project-dialog__text">{item.overview}</p>

          <h6>Key features</h6>
          <ul className="project-dialog__list small">
            {item.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <h6>Built with</h6>
          <div className="card__tags d-flex flex-wrap">
            {item.stack.map((t) => (
              <span key={t} className="rounded-tag tech-badge">
                {t}
              </span>
            ))}
          </div>

          <p className="small project-dialog__status">
            <strong>Status:</strong> {item.status}
          </p>

          {item.links?.github || item.links?.live ? (
            <div className="project-dialog__actions">
              {item.links?.github ? (
                <a
                  className="btn btn-default btn-hover btn-hover-accent"
                  href={item.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="btn-caption">GitHub</span>
                </a>
              ) : null}
              {item.links?.live ? (
                <a
                  className="btn btn-default btn-hover btn-hover-accent"
                  href={item.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="btn-caption">Live demo</span>
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="project-dialog__nav">
            <button
              type="button"
              className="project-dialog__navbtn"
              onClick={() => go(-1)}
              aria-label={`Previous project: ${prev.title}`}
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <button
              type="button"
              className="project-dialog__navbtn"
              onClick={() => go(1)}
              aria-label={`Next project: ${next.title}`}
            >
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <section id="projects" className="inner inner-first portfolio">
        {/* Content Block - H2 Section Title Start */}
        <div className="content__block section-grid-title">
          <p className="h2__subtitle animate-in-up">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="13px"
              height="13px"
              viewBox="0 0 13 13"
              fill="currentColor"
            >
              <path
                fill="currentColor"
                d="M5.6,12.6c-0.5-0.8-0.7-2.4-1.7-3.5c-1-1-2.7-1.2-3.5-1.7C-0.1,7-0.1,6,0.4,5.6c0.8-0.5,2.3-0.6,3.5-1.8
            C5,2.8,5.1,1.2,5.6,0.4C6-0.1,7-0.1,7.4,0.4c0.5,0.8,0.7,2.4,1.8,3.5c1.2,1.2,2.6,1.2,3.5,1.7c0.6,0.4,0.6,1.4,0,1.7
            C11.8,7.9,10.2,8,9.1,9.1c-1,1-1.2,2.7-1.7,3.5C7,13.1,6,13.1,5.6,12.6z"
              />
            </svg>
            <span>Projects</span>
          </p>
          <h2 className="h2__title animate-in-up">
            Check out my projects
          </h2>
        </div>
        {/* Content Block - H2 Section Title End */}
        {/* Content Block - Works Gallery Start */}
        <div className="content__block grid-block">
          <div className="container-fluid px-0 inner__gallery">
            <div
              className="row gx-0 my-gallery"
              itemType="http://schema.org/ImageGallery"
            >
              {portfolioItems.map((item, idx) => (
                <figure
                  key={idx}
                  className="col-12 col-md-6 gallery__item grid-item animate-in-up"
                  itemProp="associatedMedia"
                  itemType="http://schema.org/ImageObject"
                  data-delay={idx % 2 ? "0.3" : "0"}
                >
                  <div className="project-media">
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      setActive(idx);
                    }}
                    aria-haspopup="dialog"
                    aria-label={`View details of ${item.title}`}
                    href={item.href}
                    className="gallery__link"
                    itemProp="contentUrl"
                    data-size={`${item.width}x${item.height}`}
                  >
                    <Image
                      className="gallery__image"
                      itemProp="thumbnail"
                      alt={item.alt}
                      src={item.src}
                      width={800}
                      height={800}
                    />
                    <div
                      className="picture"
                      style={{
                        backgroundImage: `url(${item.src})`,
                      }}
                    />
                  </a>

                  <figcaption
                    className={item.figcaptionClass}
                    itemProp="caption description"
                  >
                    <h5 className={item.titleClass}>{item.title}</h5>
                    <div className="card__tags d-flex flex-wrap">
                      {item.tags.map((tag, tagIdx) => (
                        <span key={tagIdx} className="rounded-tag tech-badge">
                          {tag.text}
                        </span>
                      ))}
                    </div>
                    <p className="small">{item.description}</p>
                  </figcaption>
                  </div>
                  <div className="project-meta">
                    <h5 className="project-meta__title">{item.title}</h5>
                    <p className="small project-meta__text">{item.description}</p>
                    {item.links?.github || item.links?.live ? (
                      <div className="project-links">
                        {item.links?.live ? (
                          <a
                            className="project-link project-link--live"
                            href={item.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${item.title} live demo (opens in a new tab)`}
                          >
                            Live demo <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                        {item.links?.github ? (
                          <a
                            className="project-link"
                            href={item.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${item.title} on GitHub (opens in a new tab)`}
                          >
                            GitHub <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="text-link-bold cert-open"
                      onClick={() => setActive(idx)}
                      aria-haspopup="dialog"
                      aria-label={`View details of ${item.title}`}
                    >
                      View details
                    </button>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </div>
        {/* Content Block - Works Gallery End */}
      </section>

      {active !== null ? (
        <ProjectDialog
          index={active}
          onIndex={setActive}
          onClose={() => setActive(null)}
        />
      ) : null}
    </>
  );
}