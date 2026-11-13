"use client";
import { useEffect, useId, useRef, useState } from "react";

export type Cert = {
  title: string;
  issuer: string;
  date: string;
  note: string;
  file: string;
  group: string;
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
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (open && ref.current && !ref.current.open) ref.current.showModal();
  }, [open]);

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
      <button
        type="button"
        className="text-link-bold cert-open"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`${label}: ${cert.title}`}
      >
        {label}
      </button>
      {open ? (
        <dialog
          ref={ref}
          className="cert-dialog"
          aria-labelledby={titleId}
          onClose={() => setOpen(false)}
          onClick={(e) => {
            if (e.target === ref.current) ref.current?.close();
          }}
        >
          <div className="cert-dialog__panel" data-lenis-prevent>
            <button
              type="button"
              className="cert-dialog__close"
              aria-label="Close"
              onClick={() => ref.current?.close()}
            >
              ×
            </button>
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
            <div className="cert-dialog__actions">
              {cert.verifyUrl ? (
                <a
                  className="btn btn-default btn-hover btn-hover-accent"
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="btn-caption">Verify certificate</span>
                </a>
              ) : null}
              <a
                className="text-link-bold"
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open certificate PDF
              </a>
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
}