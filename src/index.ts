import type { Dependency, DependencyLoader } from 'dependency-owners/loader';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as YAML from 'yaml';

const mapDependency = ([name, version]: [string, unknown]): Dependency => ({
  name,
  version: String(version),
});

/**
 * Check if the loader can handle the specified file.
 * @param {string} filePath The path of the file to check.
 * @returns {Promise<boolean>} True if the file can be loaded, false otherwise.
 */
export const canLoad = async function (filePath: string): Promise<boolean> {
  return path.basename(filePath) === 'pubspec.yaml';
} satisfies DependencyLoader['canLoad'];

/**
 * Loads the pubspec.yaml file and returns its dependencies.
 * @param {string} filePath The path of the pubspec.yaml file to load.
 * @returns {Promise<Dependency[]>} An array of dependencies.
 */
export const load = async function (filePath: string): Promise<Dependency[]> {
  const pubspec = YAML.parse(await fs.readFile(filePath, 'utf-8'));
  return [
    ...Object.entries(pubspec.dependencies || {}).map(mapDependency),
    ...Object.entries(pubspec.dev_dependencies || {}).map(mapDependency),
  ];
} satisfies DependencyLoader['load'];
