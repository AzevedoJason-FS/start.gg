import Avatar from "./Avatar";

const AppBar = () => {
    return(
        <div>
            {/* logo */}
            <p>mernauth</p>
            <Avatar 
            style={styles.avatarImg}
            />
        </div>
    )
}

export default AppBar;

const styles = {
    avatarImg:{
        width: '60px',
        height: '60px',
        borderRadius: '50%'
    }
}