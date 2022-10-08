import Reset from "../components/Reset";
import { useNavigate } from "react-router-dom";

const ResetLayout = () => {
    let navigate = useNavigate();

    const handleClick = () => {
        return navigate("/");
    }

    return(
        <div>
            <Reset />
            <p onClick={handleClick}>login</p>
        </div>
    )
}

export default ResetLayout