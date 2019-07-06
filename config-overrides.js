const rewireStyl = require("react-app-rewire-stylus-modules");
const ruleChildren = (loader) => loader.use || loader.oneOf || Array.isArray(loader.loader) && loader.loader || [];
const isProd = process.env.NODE_ENV === "production";

module.exports = function override(config, env) {
	config = rewireStyl(config, env);
	if (!isProd) { // no PostCSS warnings!
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
		function enableSourceMap(loader1) {
			if (loader1 instanceof String) {
				loader1 = { loader: loader1 };
			}
			loader1.options = Object.assign({ sourceMap: true }, loader1.options);
		}
		const cssRule = findRule(config.module.rules, (rule) => rule.test && String(rule.exclude) === String(/\.module\.css$/));
		const stylRule = findRule(config.module.rules, (rule) => rule.test && String(rule.exclude) === String(/\.module\.styl$/));
		const cssModulesRule = findRule(config.module.rules, (rule) => !rule.exclude && rule.test && String(rule.test) === String(/\.css$/));
		const stylModulesRule = findRule(config.module.rules, (rule) => !rule.exclude && rule.test && String(rule.test) === String(/\.module\.styl$/));
		[cssRule.use, stylRule.use, cssModulesRule.use, stylModulesRule.use].forEach((use) => {
			use.forEach((loader) => {
				enableSourceMap(loader);
			});
		})
	}
	if (process.env.ANALYZE === "true") {
		config = require("react-app-rewire-webpack-bundle-analyzer")(config, env, {
			analyzerMode: "static",
			reportFilename: "./../report.html"
		})
	}
	const chalk = require("chalk");
	config.plugins = (config.plugins || []).concat([
		new require("progress-bar-webpack-plugin")({ format: ` [:current/:total] :percent :elapsed seconds [${chalk.green.bold(":bar")}] :msg \n`, clear:true })
	])
	return config;
}
