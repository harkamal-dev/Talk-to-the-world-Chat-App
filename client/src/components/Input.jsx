import React from "react";
import { TextField } from "@mui/material";

const Input = ({ label = "Placeholder", value, handleChange, ...rest }) => {
	return (
		<TextField
			id="outlined-basic"
			label={label}
			variant="filled"
			className="w-full"
			value={value}
			onChange={handleChange}
			{...rest}
		/>
	);
};

export default Input;
