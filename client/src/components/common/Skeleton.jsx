import classNames from "classnames";
import React from "react";

const VARIANTS = {
	title: "title",
	text: "text",
	avatar: "avatar",
};

const Skeleton = ({ variant = "title", wrapperClassName }) => {
	if (variant === VARIANTS.title) {
		return (
			<div className={classNames("animate-pulse w-40 lg:w-72 p-1", wrapperClassName)}>
				<div className="rounded-lg bg-gray-200 h-8"></div>
			</div>
		);
	}
	if (variant === VARIANTS.text) {
		return (
			<div className={classNames("animate-pulse w-40 lg:w-72 p-1", wrapperClassName)}>
				<div className="rounded-lg bg-gray-200 h-4"></div>
			</div>
		);
	}
	if (variant === VARIANTS.avatar) {
		return (
			<div className={classNames("animate-pulse", wrapperClassName)}>
				<div className="rounded-full bg-gray-200 h-10 w-10"></div>
			</div>
		);
	}
	return null;
};

export default Skeleton;
