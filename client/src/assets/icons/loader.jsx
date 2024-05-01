import React from "react";

const Loader = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 25 25"
			preserveAspectRatio="xMidYMid"
			className="lds-dual-ring"
			width="25"
			height="25"
		>
			<circle
				cx="12.5"
				cy="12.5"
				fill="none"
				stroke="#266150"
				strokeWidth="2.5"
				r="10"
				strokeDasharray="15.707963267948966 15.707963267948966"
				transform="rotate(51.5632 12.5 12.5)"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					calcMode="linear"
					values="0 12.5 12.5;360 12.5 12.5"
					keyTimes="0;1"
					dur="1s"
					begin="0s"
					repeatCount="indefinite"
				></animateTransform>
			</circle>
		</svg>
	);
};

export default Loader;
