import store from '../store/Store'
/**
 *权限控制方法
 *
 */
function hasAuthority(targertName) {
    //let userAuthority = store.state.AuthorityShow.userAuthority;
    let userAuthority=JSON.stringify(JSON.parse(window.localStorage.getItem('login_userInfo')).permissions);
    if (JSON.stringify(userAuthority).indexOf(targertName) === -1) {
        return false;
    } else {
        return true;
    }
};

export default hasAuthority;
