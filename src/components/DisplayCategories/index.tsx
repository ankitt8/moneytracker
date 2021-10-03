import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { DisplayCategoriesProps } from "./interface";

const DisplayCategories = ({
  categories,
  handleDeleteCategory
}: DisplayCategoriesProps) => {
  if (categories.length === 0) {
    return <p className={styles.noData}>!!No Categories Found!!</p>;
  }
  return (
    <div className={styles.categoriesWrapper}>
      {categories.map((category) => {
        return (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0 }}
            key={category}
            className={styles.categoryWrapper}
          >
            <div>{category}</div>
            <div>|</div>
            <FontAwesomeIcon
              icon={faWindowClose}
              onClick={() => handleDeleteCategory(category)}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default DisplayCategories;
