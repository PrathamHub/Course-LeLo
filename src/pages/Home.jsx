import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
const Home = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className="relative mx-auto flex flex-col w-11/12 items-center max-w-maxContent text-white justify-between">
        <Link to="/signup">
          <div className="group mt-16 p-1 bg-richblack-800 text-richblack-200 rounded-full mx-auto font-bold hover:scale-90 transition-all duration-200 w-fit">
            <div className="group-hover:bg-richblack-900 flex gap-3 items-center justify-center rounded-full px-10 py-[5px]">
              <p>Become an instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with
          <HighlightText text="Coding Skills" />
        </div>
        <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300 ">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore
          doloremque et cumque voluptas. Perspiciatis eaque aliquid architecto
          autem eligendi, repellat molestias atque vitae voluptatibus, commodi
          fuga molestiae, culpa eveniet voluptatum.
        </div>
        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto="/signup">
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto="/login">
            Book a demo
          </CTAButton>
        </div>
        <div className="shadow-blue-200 mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            muted
            autoPlay
            loop
            src={Banner}
            className="shadow-[20px_20px_rgba(255,255,255)]"
          ></video>
        </div>

        {/* code section 1 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your
                <HighlightText text={"coding potentials"} />
                with our online courses
              </div>
            }
            subHeading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabutton1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabutton2={{
              btnText: "Learn More",
              linkto: "/signup",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>
        {/* code section */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subHeading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabutton1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabutton2={{
              btnText: "Learn More",
              linkto: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
