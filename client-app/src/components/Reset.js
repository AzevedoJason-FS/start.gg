import { useState } from "react";
import { MdVisibility } from "react-icons/md";

const Reset = () => {
    const [visible, setVisible] = useState(false);

    const handleClick = () => {
        setVisible(!visible);
        console.log(visible)
    }
    return(
    <form>
        <div onClick={handleClick}>
            <MdVisibility />
            <input type={visible ? 'text' : 'password'} placeholder="Password" autoComplete='off'/>
            <MdVisibility />
            <input type={visible ? 'text' : 'password'} placeholder="Confirm Password" autoComplete='off'/>
        </div>
        <div style={styles.login_btn}>
                <button>login</button>
                <button>Sign in with Google</button>
        </div>
    </form>
    )
}

export default Reset

const styles = {

}