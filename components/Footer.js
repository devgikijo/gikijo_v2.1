import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 px-3 bg-white">
      <div class="col-md-4 d-flex align-items-center">
        <a
          href="/"
          class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
        >
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
      </div>

      <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li class="ms-3">
          <Link href="/" class="nav-link">
            Terms
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
