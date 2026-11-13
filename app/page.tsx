import About from "@/components/about/About";
import SvgBackgrounds from "@/components/backgrounds/SvgBackgrounds";
import Contact from "@/components/contact/Contact";
import Header1 from "@/components/headers/Header1";
import Intro from "@/components/intro/Intro";
import Portfolio from "@/components/portfolio/Portfolio";
import Profile from "@/components/profile/Profile";
import Certifications from "@/components/resume/CertificatesSection";
import Education from "@/components/resume/Education";
import Experience from "@/components/resume/Experience";
import ResumeHeading from "@/components/resume/ResumeHeading";
import Tools from "@/components/resume/Tools";

export default function Home() {
  return (
    <>
      <Header1 />
      <SvgBackgrounds />
      <Profile />
      <main id="content" className="content">
        <div className="content__wrapper">
          <Intro />
          <Portfolio />
          <About />
          <section id="resume" className="inner resume">
            <ResumeHeading />
            <Education />
            <Experience />
            <Tools />
            <Certifications />
          </section>
          <Contact />
        </div>
      </main>
    </>
  );
}
