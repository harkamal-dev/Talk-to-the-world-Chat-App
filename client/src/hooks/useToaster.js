import { toast } from "react-toastify";

const useToaster = () => {
	const showToast = (message) => {
		toast(message);
	};

	return { showToast };
};

export default useToaster;
