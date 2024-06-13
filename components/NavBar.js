import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '../context/modal';
import { useApiCall } from '../context/apiCall';
import { useRouter } from 'next/router';
import { PAGES } from '../utils/constants';

const Navbar = () => {
  const { toggleModal } = useModal();
  const { apiData } = useApiCall();
  const router = useRouter();

  const logedIn = apiData.user.data?.id && !apiData.user.isLoading;

  return (
    <nav class="navbar navbar-expand-sm border-bottom bg-white">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <Image
            src="/images/gikijo-logo.png"
            alt="image"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: 100, height: 'auto' }}
            class="d-inline-block align-text-top"
          />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mynavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mynavbar">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <Link href={PAGES.home.directory} class="nav-link">
                {PAGES.home.name}
              </Link>
            </li>
            <li class="nav-item">
              <Link href={PAGES.jobs.directory} class="nav-link">
                {PAGES.jobs.name}
              </Link>
            </li>
            {apiData.profile.data?.account_type !== 'job_seeker' ? (
              <li class="nav-item">
                <Link href={PAGES.postJob.directory} class="nav-link">
                  {PAGES.postJob.name}
                </Link>
              </li>
            ) : (
              ''
            )}
            {/* <li class="nav-item">
              <Link href="jobs" class="nav-link">
                Community
              </Link>
            </li> */}
            {/* <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                href={'/#'}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                More
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" href={'/link1'}>
                    Community
                  </Link>
                </li>
              </ul>
            </li> */}
          </ul>
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            {logedIn ? (
              <>
                {router?.route !== PAGES.dashboard.directory && (
                  <button
                    class="btn btn-primary"
                    type="button"
                    onClick={() => {
                      router.push(PAGES.dashboard.directory);
                    }}
                  >
                    <i class="bi-bar-chart-line px-2"></i>
                    {PAGES.dashboard.name}
                  </button>
                )}
                <button
                  class="btn btn-outline-primary btn-link"
                  type="button"
                  onClick={() => {
                    toggleModal('logout');
                  }}
                >
                  <i class="bi-box-arrow-right"></i>
                </button>
              </>
            ) : (
              <>
                <button
                  class="btn btn-outline-primary"
                  type="button"
                  onClick={() => {
                    toggleModal('auth');
                  }}
                >
                  {PAGES.login.name}
                </button>
                <button
                  class="btn btn-primary"
                  type="button"
                  onClick={() => {
                    toggleModal('auth');
                  }}
                >
                  {PAGES.signup.name}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
