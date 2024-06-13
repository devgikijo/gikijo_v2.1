import Link from 'next/link';
import Image from 'next/image';
import { PAGES } from '../utils/constants';
import { useRouter } from 'next/router';
import { useApiCall } from '../context/apiCall';
import { useModal } from '../context/modal';

const Navbar = ({ children }) => {
  const { apiData } = useApiCall();
  const { toggleModal } = useModal();

  const router = useRouter();

  const menuConfigAllTop = {
    dashboard: {
      title: PAGES.dashboard.name,
      action: () => {
        router.push(PAGES.dashboard.directory);
      },
      icon: <i class="fs-5 bi-bar-chart-line px-2"></i>,
      directory: PAGES.dashboard.directory,
    },
  };

  const menuConfigAllBottom = {
    settings: {
      title: PAGES.settings.name,
      action: () => {
        router.push(PAGES.settings.directory);
      },
      icon: <i class="fs-5 bi-gear px-2"></i>,
      directory: PAGES.settings.directory,
    },
    logout: {
      title: 'Logout',
      action: () => {
        toggleModal('logout');
      },
      icon: <i class="fs-5 bi-box-arrow-right px-2"></i>,
    },
  };

  const menuConfigEmployer = {
    // company_profile: {
    //   title: PAGES.company_profile.name,
    //   action: () => {
    //     router.push(PAGES.company_profile.directory);
    //   },
    //   icon: <i class="fs-5 bi-building px-2"></i>,
    //   directory: PAGES.company_profile.directory,
    // },
    job_post: {
      title: PAGES.job_post.name,
      action: () => {
        router.push(PAGES.job_post.directory);
      },
      icon: <i class="fs-5 bi-megaphone px-2"></i>,
      directory: PAGES.job_post.directory,
    },
    applicants: {
      title: PAGES.applicants.name,
      action: () => {
        router.push(PAGES.applicants.directory);
      },
      icon: <i class="fs-5 bi-people px-2"></i>,
      directory: PAGES.applicants.directory,
    },
    // channel: {
    //   title: PAGES.channel.name,
    //   action: () => {
    //     router.push(PAGES.channel.directory);
    //   },
    //   icon: <i class="fs-5 bi-send-plus px-2"></i>,
    //   directory: PAGES.channel.directory,
    // },
  };

  const menuConfigJobSeeker = {
    application: {
      title: PAGES.application.name,
      action: () => {
        router.push(PAGES.application.directory);
      },
      icon: <i class="fs-5 bi-file-earmark-arrow-up px-2"></i>,
      directory: PAGES.application.directory,
    },
    // manage_profile: {
    //   title: PAGES.manage_profile.name,
    //   action: () => {
    //     router.push(PAGES.manage_profile.directory);
    //   },
    //   icon: <i class="fs-5 bi-file-earmark-person px-2"></i>,
    //   directory: PAGES.manage_profile.directory,
    // },
  };

  const menuConfigAdmin = {
    admin: {
      title: PAGES.admin.name,
      action: () => {
        router.push(PAGES.admin.directory);
      },
      icon: <i class="fs-5 bi-sliders2 px-2"></i>,
      directory: PAGES.admin.directory,
    },
  };

  const rolePageConfig = {
    employer: {
      menus: {
        ...menuConfigAllTop,
        ...menuConfigEmployer,
        ...menuConfigAllBottom,
      },
    },
    job_seeker: {
      menus: {
        ...menuConfigAllTop,
        ...menuConfigJobSeeker,
        ...menuConfigAllBottom,
      },
    },
    admin: {
      menus: {
        ...menuConfigAllTop,
        ...menuConfigAdmin,
        ...menuConfigAllBottom,
      },
    },
  };

  return (
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-white">
          <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <ul
              class="w-100 nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start me-auto"
              id="menu"
            >
              <li
                class="w-100 pb-1 border-bottom text-muted mb-3 clickable"
                onClick={() => {
                  router.push(PAGES.profile.directory);
                }}
              >
                <div class="py-2 px-0" href="/settings">
                  <i class="fs-5 bi-person-circle px-2"></i>{' '}
                  <span class="d-none d-sm-inline text-truncate">
                    {apiData.profile.data?.username || 'Username'}
                  </span>
                </div>
              </li>
              {rolePageConfig[apiData.profile.data?.account_type]?.menus &&
                Object.values(
                  rolePageConfig[apiData.profile.data?.account_type]?.menus
                ).map((item, index) => {
                  const isItemSelected = router?.route === item.directory;
                  const linkClass = `nav-link nav-link-side-bar px-0 ${
                    isItemSelected ? 'nav-link-side-bar-selected' : ''
                  }`;

                  return (
                    <li class="w-100 pb-0" key={index}>
                      {item.directory ? (
                        <Link href={item.directory} class={linkClass}>
                          {item.icon}{' '}
                          <span class="d-none d-sm-inline">{item.title}</span>
                        </Link>
                      ) : (
                        <div class={linkClass} onClick={item.action}>
                          {item.icon}{' '}
                          <span class="d-none d-sm-inline">{item.title}</span>
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
            <hr />
          </div>
        </div>
        <div class="col py-3">{children}</div>
      </div>
    </div>
  );
};
export default Navbar;
