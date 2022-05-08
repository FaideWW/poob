import { useMemo, useEffect } from "react";
import { SkillTreeProps } from "./types";
import useCanvas from "../../hooks/useCanvas";
import createDrawSkillTree from "./drawSkillTree";
import loadSkillTreeAssets from "./loadSkillTreeAssets";
import styles from "./styles.module.scss";

export default function SkillTree(props: SkillTreeProps): JSX.Element {
  const draw = useMemo(
    () => createDrawSkillTree(props.skillTree),
    [props.skillTree]
  );

  const canvasRef = useCanvas({ draw });
  return <canvas ref={canvasRef} className={styles.canvas} />;
}
