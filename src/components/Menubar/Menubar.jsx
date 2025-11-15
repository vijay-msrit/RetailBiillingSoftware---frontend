import './Menubar.css';
import {assets} from "../../assets/assets.js";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useContext, useRef} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import {useTheme} from "../../context/ThemeContext.jsx";
import toast from "react-hot-toast";

const Menubar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {setAuthData, auth, profilePhoto, updateProfilePhoto, companyLogo, updateCompanyLogo} = useContext(AppContext);
    const {theme, toggleTheme} = useTheme();
    const fileInputRef = useRef(null);
    const logoInputRef = useRef(null);
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("profilePhoto");
        localStorage.removeItem("companyLogo");
        updateProfilePhoto(null);
        updateCompanyLogo(null);
        setAuthData(null, null);
        navigate("/login");
    }

    const isActive = (path) => {
        return location.pathname === path;
    }

    const isAdmin = auth.role === "ROLE_ADMIN";

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProfilePhoto(reader.result);
                toast.success('Profile photo updated successfully');
            };
            reader.onerror = () => {
                toast.error('Error reading image file');
            };
            reader.readAsDataURL(file);
        }
        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemovePhoto = () => {
        updateProfilePhoto(null);
        toast.success('Profile photo removed');
    };

    const handleCompanyLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                updateCompanyLogo(reader.result);
                toast.success('Company logo updated successfully');
            };
            reader.onerror = () => {
                toast.error('Error reading image file');
            };
            reader.readAsDataURL(file);
        }
        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    const handleLogoUploadClick = () => {
        logoInputRef.current?.click();
    };

    const profileImageSrc = profilePhoto || assets.profile;
    const logoImageSrc = companyLogo || assets.logo;

    return (
        <nav className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light'} px-2`}>
            <a className="navbar-brand" href="#" style={{cursor: 'pointer'}} onClick={(e) => { e.preventDefault(); handleLogoUploadClick(); }} title="Click to change logo">
                <img src={logoImageSrc} alt="Company Logo" height="40" className="company-logo" />
            </a>
            <input
                type="file"
                ref={logoInputRef}
                onChange={handleCompanyLogoChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse p-2" id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive('/dashboard') ? 'fw-bold text-warning': ''}`} to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive('/explore') ? 'fw-bold text-warning': ''}`} to="/explore">Explore</Link>
                    </li>
                    {
                        isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/items') ? 'fw-bold text-warning': ''}`} to="/items">Manage Items</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/category') ? 'fw-bold text-warning': ''}`} to="/category">Manage Categories</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/users') ? 'fw-bold text-warning': ''}`} to="/users">Manage Users</Link>
                                </li>
                            </>
                        )
                    }
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive('/orders') ? 'fw-bold text-warning': ''}`} to="/orders">Order History</Link>
                    </li>
                </ul>
                {/*Theme Toggle Button*/}
                <button 
                    className="theme-toggle-btn me-3" 
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {theme === 'dark' ? (
                        <i className="bi bi-sun-fill"></i>
                    ) : (
                        <i className="bi bi-moon-fill"></i>
                    )}
                </button>
                {/*Add the dropdown for userprofile*/}
                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item dropdown">
                        <a href="#" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={profileImageSrc} alt="Profile" height={32} width={32} className="profile-image" />
                        </a>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleProfilePhotoChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li>
                                <a href="#!" className="dropdown-item" onClick={(e) => { e.preventDefault(); handleUploadClick(); }}>
                                    <i className="bi bi-camera-fill me-2"></i>
                                    {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                                </a>
                            </li>
                            {profilePhoto && (
                                <li>
                                    <a href="#!" className="dropdown-item" onClick={(e) => { e.preventDefault(); handleRemovePhoto(); }}>
                                        <i className="bi bi-trash-fill me-2"></i>
                                        Remove Photo
                                    </a>
                                </li>
                            )}
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a href="#!" className="dropdown-item">
                                    <i className="bi bi-gear-fill me-2"></i>
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="dropdown-item">
                                    <i className="bi bi-clock-history me-2"></i>
                                    Activity log
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a href="#!" className="dropdown-item" onClick={logout}>
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Menubar;