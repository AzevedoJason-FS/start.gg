import AppBar from "../components/AppBar";
import SideBar from "../components/SideBar";
import Feed from "../components/Feed";
import Profile from "../components/Profile";

const ProfileLayout = () => {
    return(
        <div>
            <Profile />
            <AppBar />
            <SideBar />
            <Feed />
        </div>
    )
}

export default ProfileLayout;