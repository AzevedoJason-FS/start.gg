import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Avatar = ({avatar}) => {

    const { user } = useContext(AuthContext)

    return(
        <div>
            <img src={avatar ? avatar : user.avatar} alt="avatar" style={styles.avatarImg} />
        </div>
    )
}

export default Avatar;

const styles = {
    avatarImg:{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        cursor: 'pointer'
    },
}

