import Link from 'next/link';
import { PAGES } from '../utils/constants';

const Breadcrumb = ({ page }) => {
  return (
    <>
      <nav class="breadcrumb-devider" aria-label="breadcrumb">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item clickable">
              <small>
                <Link href={PAGES.home.directory} class="breadcrumb-text">
                  <i class="bi bi-house"></i> {PAGES.home.name}
                </Link>
              </small>
            </li>
            <li class="breadcrumb-item active">
              <span class="badge breadcrumb-badge">{page.name}</span>
            </li>
          </ol>
        </nav>
      </nav>
    </>
  );
};

export default Breadcrumb;
