import tools from "@/data/tools.json";

type ToolGroup = { group: string; items: string[] };

export default function Tools() {
  return (
    <>
      <div className="content__block">
        <div className="section-h3 section-h3-grid">
          <h3 className="h3__title animate-in-up">Technical skills</h3>
        </div>
      </div>
      <div className="content__block grid-block block-large">
        <div className="container-fluid p-0 resume-lines">
          {(tools as ToolGroup[]).map((g) => (
            <div className="row g-0 resume-lines__item animate-in-up" key={g.group}>
              <div className="col-12 col-md-4">
                <h5 className="resume-lines__title animate-in-up">{g.group}</h5>
              </div>
              <div className="col-12 col-md-8">
                <div className="cards__tags d-flex flex-wrap animate-in-up">
                  {g.items.map((item) => (
                    <span key={item} className="rounded-tag tag-outline">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
