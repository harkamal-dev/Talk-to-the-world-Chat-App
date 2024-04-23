import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function UserAutocomplete({ usersList, value, setValue }) {
	const [inputValue, setInputValue] = React.useState("");
	return (
		<Autocomplete
			value={value}
			onChange={(event, newValue) => {
				setValue(newValue);
			}}
			inputValue={inputValue}
			onInputChange={(event, newInputValue) => {
				setInputValue(newInputValue);
			}}
			id="user-autocomplete"
			options={usersList}
			renderInput={(params) => <TextField {...params} label="Type or select to chat" />}
		/>
	);
}
