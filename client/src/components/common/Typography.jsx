import React from "react";
import { Typography } from "@mui/material";
import classNames from "classnames";

const CustomTypography = ({ label = "Talk To The World", variant = "h5", className,wrapperClassName, ...rest }) => {
	return (
		<div className={wrapperClassName}>
			<Typography
				variant={variant}
				component="h2"
				className={classNames("text-textBlack text-center !font-bold ubuntu-regular  break-words", className)}
				{...rest}
			>
				{label}
			</Typography>
		</div>
	);
};

export default CustomTypography;
