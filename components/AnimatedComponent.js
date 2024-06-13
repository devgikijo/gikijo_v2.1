import { motion } from 'framer-motion';

function AnimatedComponent({
  children,
  stageIndex = 0,
  animateByIndex = false,
  type = 'default',
}) {
  const variantConfig = {
    default: {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: animateByIndex ? 0.4 + stageIndex : 0.4,
          type: 'spring',
        },
      },
    },
    swipeLeft: {
      hidden: { opacity: 0, x: -20 },
      show: {
        opacity: 1,
        x: 0,
        transition: {
          duration: animateByIndex ? 0.4 + stageIndex : 0.4,
          type: 'spring',
        },
      },
    },
    swipeRight: {
      hidden: { opacity: 0, x: 20 },
      show: {
        opacity: 1,
        x: 0,
        transition: {
          duration: animateByIndex ? 0.4 + stageIndex : 0.4,
          type: 'spring',
        },
      },
    },
  };

  return (
    <motion.div
      className="z-10"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: 'spring' }}
      key={stageIndex}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={variantConfig[type]}>{children}</motion.div>
      </motion.div>
    </motion.div>
  );
}

export default AnimatedComponent;
