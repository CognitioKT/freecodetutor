import fs from 'fs';
import path from 'path';
import { getChallengeSeeds } from '../utils';
import { getProjectPath } from './get-project-path';
import { ChallengeSeed } from './get-step-template';

// Looks up the last file found with format `step-###.md` in a directory and
// returns associated information to it. At the same time validates that the
// number of files match the names used to name these.
function getLastStepFileContent(): {
  challengeSeeds: Record<string, ChallengeSeed>;
  nextStepNum: number;
} {
  const filesArr: string[] = [];
  const projectPath = getProjectPath();

  fs.readdirSync(projectPath).forEach(fileName => {
    if (path.extname(fileName).toLowerCase() === '.md') {
      filesArr.push(fileName);
    }
  });

  // TODO: this looks like it relies on the file order, but that was sketchy
  // before and won't work when we have ids as names.
  const lastStepFilename = filesArr[filesArr.length - 1];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const lastStepFileString: string = lastStepFilename
    .split('.')[0]
    .split('-')[1];
  const lastStepFileNum = parseInt(lastStepFileString, 10);
  if (filesArr.length !== lastStepFileNum) {
    throw `Error: The last file step is ${lastStepFileNum} and there are ${filesArr.length} files.`;
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    challengeSeeds: getChallengeSeeds(projectPath + lastStepFilename),
    nextStepNum: lastStepFileNum + 1
  };
}

export { getLastStepFileContent };
