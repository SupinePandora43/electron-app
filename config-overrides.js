const path = require("path");
const rewireStyl = require("react-app-rewire-stylus-modules");

const ruleChildren = (loader) => loader.use || loader.oneOf || Array.isArray(loader.loader) && loader.loader || [];

const findIndexAndRules = (rulesSource, ruleMatcher) => {
	let result = undefined;
	const rules = Array.isArray(rulesSource) ? rulesSource : ruleChildren(rulesSource);
	rules.some((rule, index) => result = ruleMatcher(rule) ? { index, rules } : findIndexAndRules(ruleChildren(rule), ruleMatcher));
	return result;
}

const findRule = (rulesSource, ruleMatcher) => {
	const { index, rules } = findIndexAndRules(rulesSource, ruleMatcher);
	return rules[index];
}
const createLoaderMatcher = (loader) => (rule) => rule.loader && rule.loader.indexOf(`${path.sep}${loader}${path.sep}`) !== -1;
const cssRuleMatcher = (rule) => rule.test && String(rule.exclude) === String(/\.module\.css$/);
const cssModuleRuleMatcher = (rule) => !rule.exclude && rule.test && String(rule.test) === String(/\.css$/);
const stylRuleMatcher = (rule) => rule.test && String(rule.exclude) === String(/\.module\.styl$/);
const stylModuleRuleMatcher = (rule) => !rule.exclude && rule.test && String(rule.test) === String(/\.module\.styl$/);

function enableSourceMap(loader1) {
	if (loader1 instanceof String) {
		loader1 = { loader: loader1 };
	}
	loader1.options = Object.assign({ sourceMap: true }, loader1.options);
}
module.exports = function override(config, env) {
	config = rewireStyl(config, env);
	const cssRule = findRule(config.module.rules, cssRuleMatcher);
	const stylRule = findRule(config.module.rules, stylRuleMatcher);
	const cssModulesRule = findRule(config.module.rules, cssModuleRuleMatcher);
	const stylModulesRule = findRule(config.module.rules, stylModuleRuleMatcher);
	for (const use of [cssRule.use, stylRule.use, cssModulesRule.use, stylModulesRule.use]) {
		for (const loader in use) {
			if (loader) { enableSourceMap(loader); }
		}
	}
	//
	// [cssRule.use, stylRule.use, cssModulesRule.use, stylModulesRule.use].forEach((use) => {
		// use.forEach((loader) => {
			// enableSourceMap(loader);
		// });
	// })
	config = Object.assign({devtool:"source-map"}, config);
	// stylRule.use[stylRule.use.length - 1] = { loader: stylRule.use[stylRule.use.length - 1], options: { sourceMap: true } };
	// const stylLoader = findRule(stylRule.use, createLoaderMatcher('stylus-loader'));
	// stylLoader.options = Object.assign({sourceMap:true}, stylLoader.options);

	// stylRule.use.forEach(loader => {
	// loader.options = Object.assign({ sourceMap: true }, loader.options);
	// });
	return config;
}