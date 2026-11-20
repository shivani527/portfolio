"use client";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type Cert = {
  title: string;
  issuer: string;
  date: string;
  note: string;
  file: string;
  group: string;
  preview?: string;
  previewWidth?: number;
  previewHeight?: number;
  score?: string;
  period?: string;
  tasks?: string[];
  language?: string;
  verificationCode?: string;
  userCode?: string;
  enrolmentNumber?: string;
  verifyUrl?: string;
};

export default function CertificateButton({
  cert,
  label = "View certificate",
}: {
  cert: Cert;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (open && ref.current && !ref.current.open) ref.current.showModal();
  }, [open]);

  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      ref.current?.close();
      setOpen(false);
      setClosing(false);
    }, 220);
  }, [closing]);

  // Only show details that are printed on the certificate
  const rows: [string, string | undefined][] = [
    ["Company", cert.issuer],
    ["Issued", cert.date],
    ["Score", cert.score],
    ["Duration", cert.period],
    ["Language", cert.language],
    ["User code", cert.userCode],
    ["Enrolment number", cert.enrolmentNumber],
  ];

  return (
    <>
      <div className="project-links cert-actions">
        <button
          type="button"
          className="project-link cert-open"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={`${label}: ${cert.title}`}
        >
          {label}
        </button>
      </div>
      {open ? (
        <dialog
          ref={ref}
          className={`cert-dialog${closing ? " is-closing" : ""}`}
          aria-labelledby={titleId}
          data-lenis-prevent
          onCancel={(e) => {
            e.preventDefault();
            requestClose();
          }}
          onClick={(e) => {
            if (e.target === ref.current) requestClose();
          }}
        >
          <div
            className={`cert-dialog__shell${cert.preview ? "" : " cert-dialog__shell--single"}`}
          >
            <button
              type="button"
              className="cert-dialog__close"
              aria-label="Close certificate"
              onClick={requestClose}
            >
              ×
            </button>

            {cert.preview ? (
              <div className="cert-dialog__media">
                <Image
                  className="cert-dialog__img"
                  src={cert.preview}
                  alt={`Certificate: ${cert.title}`}
                  width={cert.previewWidth ?? 1400}
                  height={cert.previewHeight ?? 990}
                  sizes="(max-width: 900px) 92vw, 680px"
                  quality={90}
                />
              </div>
            ) : null}

            <div className="cert-dialog__panel">
              <h4 id={titleId} className="cert-dialog__title">
                {cert.title}
              </h4>
              <dl className="cert-dialog__list">
                {rows
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="cert-dialog__row">
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                {cert.verificationCode ? (
                  <div className="cert-dialog__row">
                    <dt>Verification code</dt>
                    <dd>
                      {cert.verifyUrl ? (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Verify certificate with code ${cert.verificationCode} (opens in a new tab)`}
                        >
                          {cert.verificationCode}
                        </a>
                      ) : (
                        cert.verificationCode
                      )}
                    </dd>
                  </div>
                ) : null}
                {cert.tasks && cert.tasks.length ? (
                  <div className="cert-dialog__row">
                    <dt>Practical tasks</dt>
                    <dd>
                      <ul className="cert-dialog__tasks">
                        {cert.tasks.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ) : null}
              </dl>
              <div className="project-links cert-dialog__actions">
                {cert.verifyUrl ? (
                  <a
                    className="project-link project-link--live"
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Verify certificate <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                <a
                  className="project-link"
                  href={cert.file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open PDF <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
}