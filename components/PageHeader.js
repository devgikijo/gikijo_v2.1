import Link from 'next/link';
import Image from 'next/image';

const PageHeader = ({ title, description, rightContent }) => {
  return (
    <>
      <div class="row mb-3">
        <div class="col">
          <h4 class="mb-0 fw-bolder">{title}</h4>
          <small>{description}</small>
        </div>
        <div class="col text-end">{rightContent}</div>
      </div>
    </>
  );
};

export default PageHeader;
