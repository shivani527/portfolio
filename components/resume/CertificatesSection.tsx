import certs from "@/data/certifications.json";
import CertificateButton, { type Cert } from "./CertificateButton";

const sections = [
  { id: "experience", heading: "Training & Experience" },
  { id: "certifications", heading: "Professional Certifications" },
  { id: "participation", heading: "Hackathons & Participation" },
];

export default function CertificatesSection() {
  return (
    <>
      {sections.map((sec) => (
        <div className="content__block block-large" key={sec.id}>
          <div className="section-h3">
            <h3 className="h3__title animate-in-up">{sec.heading}</h3>
          </div>
          <div className="container-fluid p-0 resume-lines">
            {(certs as Cert[])
              .filter((c) => c.group === sec.id)
              .map((c) => (
                <div className="row g-0 resume-lines__item animate-in-up" key={c.file}>
                  <div className="col-12 col-md-2">
                    <span className="resume-lines__date animate-in-up">{c.date}</span>
                  </div>
                  <div className="col-12 col-md-5">
                    <h5 className="resume-lines__title animate-in-up">{c.title}</h5>
                    <p className="resume-lines__source animate-in-up">{c.issuer}</p>
                  </div>
                  <div className="col-12 col-md-5">
                    {c.note ? (
                      <p className="small resume-lines__descr animate-in-up">{c.note}</p>
                    ) : null}
                    <p className="small resume-lines__descr animate-in-up">
                      <CertificateButton cert={c} />
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}