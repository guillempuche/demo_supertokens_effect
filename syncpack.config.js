// @ts-check

/**
 * Syncpack docs https://jamiemason.github.io/
 */

/** @type {import("syncpack").RcFile} */
export default {
	dependencyTypes: ['dev', 'prod', 'overrides', 'peer', 'resolutions'],
	filter: '.',
	indent: '	', // One tab
	semverGroups: [
		{
			range: '^',
			packages: ['react', 'react-dom', 'react-native', '@types/react'],
		},
		{
			range: '^',
			packages: ['@tamagui/**', 'tamagui'],
		},
	],
	sortAz: [
		'dependencies',
		'devDependencies',
		'peerDependencies',
		'resolutions',
		'scripts',
	],
	sortFirst: [
		'name',
		'version',
		'description',
		'packageManager',
		'engines',
		'main',
		'react-native',
		'types',
		'type',
		'module',
		'import',
		'exports',
		'workspaces',
		'scripts',
		'peerDependencies',
		'dependencies',
		'devDependencies',
		'resolutions',
		'author',
		'repository',
		'private',
	],
	sortPackages: true,
	source: [
		'package.json',
		'xiroi-apps/*/package.json',
		'xiroi-packages/**/package.json',
	],
}
