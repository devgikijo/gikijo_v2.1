import Image from 'next/image';
import AnimatedComponent from '../components/AnimatedComponent';
import GlobalButton from '../components/GlobalButton';
import { useModal } from '../context/modal';

const main = () => {
  const { toggleModal } = useModal();

  return (
    <div className="body">
      <section class="container text-center">
        <AnimatedComponent stageIndex={1} animateByIndex={true}>
          <Image
            src="/images/under-constructions.svg"
            alt="image"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '30%', height: '30%' }}
            class="d-inline-block align-text-top"
          />
        </AnimatedComponent>
        <AnimatedComponent stageIndex={2} animateByIndex={true}>
          <h1>We are Under Maintenance</h1>
          <p class="text-muted">
            Our website is currently undergoing maintenance. Thank you for your
            understanding.
          </p>
          <GlobalButton
            btnType="button"
            btnClass="btn btn-outline-secondary mt-4"
            btnOnClick={() => {
              toggleModal('auth');
            }}
          >
            Admin Login
          </GlobalButton>
        </AnimatedComponent>
      </section>
    </div>
  );
};

export default main;
