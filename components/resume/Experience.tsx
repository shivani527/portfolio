import certs from "@/data/certifications.json";
import CertificateButton, { type Cert } from "./CertificateButton";
import experienceItems from "@/data/experiences.json";

type ExperienceItem = {
  date: string;
  title: string;
  agency: {
    name: string;
    link: string;
  };
  description: string;
  type: string;
  certificate?: string;
};

const certData = certs as Cert[];

export default function Experience() {
  return (
    <div className="content__block block-large">
      {/* H3 Block Start */}
      <div className="section-h3">
        <h3 className="h3__title animate-in-up">Internship and training</h3>
      </div>
      {/* H3 Block End */}
      {/* Experience Lines Start */}
      <div className="container-fluid p-0 resume-lines">
        {(experienceItems as ExperienceItem[]).map((item, idx) => (
          <div className="row g-0 resume-lines__item animate-in-up" key={idx}>
            <div className="col-12 col-md-2">
              <span className="resume-lines__date animate-in-up">
                {item.date}
              </span>
            </div>
            <div className="col-12 col-md-5">
              <h5 className="resume-lines__title animate-in-up">
                {item.title}
              </h5>
              <p className="resume-lines__source animate-in-up">
                {item.type} at{" "}
                {item.agency.link ? (
                  <a
                    href={item.agency.link}
                    className="text-link-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.agency.name}
                  </a>
                ) : (
                  <span className="text-link-bold">{item.agency.name}</span>
                )}
              </p>
            </div>
            <div className="col-12 col-md-5">
              <p className="small resume-lines__descr animate-in-up">
                {item.description}
              </p>
              {item.certificate ? (
                <p className="small resume-lines__descr animate-in-up">
                  {certData.find((c) => c.file === item.certificate) ? (
                    <CertificateButton
                      cert={certData.find((c) => c.file === item.certificate)!}
                    />
                  ) : null}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {/* Experience Lines End */}
    </div>
  );
}