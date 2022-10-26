import DescriptionAndCTA from "./DescriptionAndCTA";
import LogoAndNavigation from "./LogoNavigation";

interface IProps {
  toggleVideoPopup: () => void;
}

function TopPanel(props: IProps) {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="h-full max-w-7xl mx-auto">
        <div className="bg-white relative z-10 lg:max-w-3xl lg:w-full pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <LogoAndNavigation />
          <DescriptionAndCTA toggleVideoPopup={props.toggleVideoPopup} />

          {/* White angled boundary between content and photo */}
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
        </div>
      </div>

      {/* Photo on top right of page */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="/assets/images/woman-with-laptop.jpg"
          alt="Woman with laptop"
        />
      </div>
    </div>
  );
}

export default TopPanel;
