import { Button } from "@mui/material";
import React from "react";

const CustomButton = ({ label, onClick, ...rest }) => {
	return (
		<Button variant="contained" size="large" onClick={onClick} className="ubuntu-medium" {...rest}>
			{label}
		</Button>
	);
};

export default CustomButton;
