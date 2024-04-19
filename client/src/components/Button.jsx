import { Button } from "@mui/material";
import React from "react";

const CustomButton = ({ label, onClick, ...rest }) => {
	return (
		<Button variant="contained" size="large" className="!bg-textBg" onClick={onClick} {...rest}>
			{label}
		</Button>
	);
};

export default CustomButton;
