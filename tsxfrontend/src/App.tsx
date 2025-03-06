import { Link } from "react-router-dom";
import BoxReveal from "./components/BoxReveal";
import { MorphingTextDemo } from "./components/Demo";
import ScriptGenerator from "./components/Generator";
import { SphereAnimation } from "./components/Sphere";
import Voice from "./components/Voice";

function App() {
  return (
    <div className="bg-black h-screen w-screen overflow-x-hidden px-32 text-white ">
      <div className="flex justify-center items-center gap-9 ml-9">
      <div className="basis-1/2">
        <MorphingTextDemo />
        <div className="mt-9 font-poppins">
          <BoxReveal color="#fe7cff">
            <p className="text-[3.5rem] font-semibold">
              VoiceForge<span className="text-[#fe7cff]">.</span>
            </p>
          </BoxReveal>

          <BoxReveal color="#fe7cff" duration={0.8}>
            <h2 className="mt-[.5rem] text-[1.2rem]">
              Transform your voice with
              <span className="text-[#fe7cff]"> AI-powered cloning.</span>
            </h2>
          </BoxReveal>

          <BoxReveal color="#fe7cff" duration={1}>
            <div className="mt-6">
              <p>
                -&gt; Create realistic, custom voices with
                <span className="font-semibold text-[#fe7cff]"> cutting-edge AI</span>.
                <br />
                -&gt; Perfect for
                <span className="font-semibold text-[#fe7cff]"> podcasts</span>,
                <span className="font-semibold text-[#fe7cff]"> videos</span>,
                <span className="font-semibold text-[#fe7cff]"> games</span>, and
                <span className="font-semibold text-[#fe7cff]"> more</span>.
                <br />
                -&gt; 100% customizable and easy to use.
                <br />
              </p>
            </div>

            <Link to={'/voice'} className="text-[#fe7cff] font-poppins uppercase">
              Get Started
            </Link>
          </BoxReveal>
          </div>
        </div>
        <div className="basis-2/4"><SphereAnimation /></div>
      </div>


      {/* <Voice/> */}
      {/* <ScriptGenerator/> */}

    </div>
  );
}

export default App;
