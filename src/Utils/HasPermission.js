import { useSelector } from 'react-redux';

const usePermissionCheck = () => {
    const permissions = useSelector(state => state.Permissions.permissions);

    const hasPermission = (permissionName) => {
        return permissions.some(permission => permission.name.toLowerCase() === permissionName.toLowerCase());
    };

    return hasPermission;
};

export default usePermissionCheck;