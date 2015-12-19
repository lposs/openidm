/**
 * The contents of this file are subject to the terms of the Common Development and
 * Distribution License (the License). You may not use this file except in compliance with the
 * License.
 *
 * You can obtain a copy of the License at legal/CDDLv1.0.txt. See the License for the
 * specific language governing permission and limitations under the License.
 *
 * When distributing Covered Software, include this CDDL Header Notice in each file and include
 * the License file at legal/CDDLv1.0.txt. If applicable, add the following below the CDDL
 * Header, with the fields enclosed by brackets [] replaced by your own identifying
 * information: "Portions copyright [year] [name of copyright owner]".
 *
 * Copyright 2015 ForgeRock AS.
 */

/*global require, define*/
define([
    "text!templates/common/MediumBaseTemplate.html"
], function () {

    /* an unfortunate need to duplicate the file names here, but I haven't
     yet found a way to fool requirejs into doing dynamic dependencies */
    var staticFiles = [
            "templates/common/MediumBaseTemplate.html"
        ],
        deps = arguments;

    return function (server) {

        _.each(staticFiles, function (file, i) {
            server.respondWith(
                "GET",
                new RegExp(file.replace(/([\/\.\-])/g, "\\$1") + "$"),
                [
                    200,
                    { },
                    deps[i]
                ]
            );
        });


        server.respondWith(
            "GET",
            "/openidm/managed/user?_queryId=for-userName&uid=FakeTest",
            [
                200,
                { },
                "{\"result\":[{\"mail\":\"fake@fake.com\",\"sn\":\"Fake\",\"passwordAttempts\":\"0\",\"lastPasswordAttempt\":\"Mon Sep 15 2014 11:16:05 GMT-0700 (PDT)\",\"address2\":\"\",\"givenName\":\"Fake\",\"effectiveRoles\":[\"openidm-authorized\"],\"country\":\"\",\"city\":\"\",\"lastPasswordSet\":\"\",\"postalCode\":\"\",\"_id\":\"19cde185-5712-4514-bcf2-d3103985f24a\",\"_rev\":\"1\",\"accountStatus\":\"active\",\"telephoneNumber\":\"\",\"roles\":[\"openidm-authorized\"],\"effectiveAssignments\":null,\"postalAddress\":\"\",\"userName\":\"FakeTest\",\"stateProvince\":\"\"}],\"resultCount\":1,\"pagedResultsCookie\":null,\"remainingPagedResults\":-1}"
            ]
        );

        server.respondWith(
            "GET",
            "/openidm/managed/role?_queryId=query-all&fields=*",
            [
                200,
                { },
                "{\"result\":[],\"resultCount\":0,\"pagedResultsCookie\":null,\"remainingPagedResults\":-1}"
            ]
        );

        server.respondWith(
            "GET",
            "/openidm/endpoint/linkedView/managed/user/19cde185-5712-4514-bcf2-d3103985f24a",
            [
                200,
                { },
                "{\"mail\":\"fake@fake.com\",\"sn\":\"Fake\",\"passwordAttempts\":\"0\",\"lastPasswordAttempt\":\"Mon Sep 15 2014 11:16:05 GMT-0700 (PDT)\",\"address2\":\"\",\"givenName\":\"Fake\",\"effectiveRoles\":[\"openidm-authorized\"],\"country\":\"\",\"city\":\"\",\"lastPasswordSet\":\"\",\"postalCode\":\"\",\"_id\":\"19cde185-5712-4514-bcf2-d3103985f24a\",\"_rev\":\"1\",\"accountStatus\":\"active\",\"telephoneNumber\":\"\",\"roles\":[\"openidm-authorized\"],\"effectiveAssignments\":{},\"postalAddress\":\"\",\"userName\":\"FakeTest\",\"stateProvince\":\"\",\"linkedTo\":[{\"content\":{\"telephoneNumber\":null,\"description\":null,\"mail\":\"fake@fake.com\",\"cn\":\"Fake Fake\",\"sn\":\"Fake\",\"dn\":\"uid=FakeTest,ou=People,dc=example,dc=com\",\"ldapGroups\":[],\"givenName\":\"Fake\",\"uid\":\"FakeTest\",\"_id\":\"uid=FakeTest,ou=People,dc=example,dc=com\"},\"mappings\":[{\"name\":\"systemLdapAccounts_managedUser\",\"type\":\"source\"},{\"name\":\"managedUser_systemLdapAccounts\",\"type\":\"target\"}],\"linkType\":\"systemLdapAccounts_managedUser\",\"resourceName\":\"system/ldap/account/uid=FakeTest,ou=People,dc=example,dc=com\"}]}"
            ]
        );

        server.respondWith(
            "GET",
            "/openidm/policy/managed/user/19cde185-5712-4514-bcf2-d3103985f24a",
            [
                200,
                { },
                "{\"resource\":\"managed/user/*\",\"properties\":[{\"policyRequirements\":[\"CANNOT_CONTAIN_CHARACTERS\"],\"policies\":[{\"policyRequirements\":[\"CANNOT_CONTAIN_CHARACTERS\"],\"params\":{\"forbiddenChars\":[\"/\"]},\"policyId\":\"cannot-contain-characters\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var i, join = function (arr, d) {\\n        var j, list = \\\"\\\";\\n        for (j in arr) {\\n            list += arr[j] + d;\\n        }\\n        return list.replace(new RegExp(d + \\\"$\\\"), \\\"\\\");\\n    };\\n    if (typeof (value) === \\\"string\\\" && value.length) {\\n        for (i in params.forbiddenChars) {\\n            if (value.indexOf(params.forbiddenChars[i]) !== -1) {\\n                return [{\\\"policyRequirement\\\":\\\"CANNOT_CONTAIN_CHARACTERS\\\", \\\"params\\\":{\\\"forbiddenChars\\\":join(params.forbiddenChars, \\\", \\\")}}];\\n            }\\n        }\\n    }\\n    return [];\\n}\\n\"}],\"name\":\"_id\"},{\"policyRequirements\":[\"REQUIRED\",\"UNIQUE\",\"CANNOT_CONTAIN_CHARACTERS\"],\"policies\":[{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"required\",\"policyFunction\":\"\\nfunction (fullObject, value, params, propName) {\\n    if (value === undefined) {\\n        return [{\\\"policyRequirement\\\":\\\"REQUIRED\\\"}];\\n    }\\n    return [];\\n}\\n\"},{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"not-empty\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    if (value !== undefined && (value === null || !value.length)) {\\n        return [{\\\"policyRequirement\\\":\\\"REQUIRED\\\"}];\\n    } else {\\n        return [];\\n    }\\n}\\n\"},{\"policyRequirements\":[\"UNIQUE\"],\"policyId\":\"unique\"},{\"policyRequirements\":[\"UNIQUE\"],\"policyId\":\"no-internal-user-conflict\"},{\"policyRequirements\":[\"CANNOT_CONTAIN_CHARACTERS\"],\"params\":{\"forbiddenChars\":[\"/\"]},\"policyId\":\"cannot-contain-characters\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var i, join = function (arr, d) {\\n        var j, list = \\\"\\\";\\n        for (j in arr) {\\n            list += arr[j] + d;\\n        }\\n        return list.replace(new RegExp(d + \\\"$\\\"), \\\"\\\");\\n    };\\n    if (typeof (value) === \\\"string\\\" && value.length) {\\n        for (i in params.forbiddenChars) {\\n            if (value.indexOf(params.forbiddenChars[i]) !== -1) {\\n                return [{\\\"policyRequirement\\\":\\\"CANNOT_CONTAIN_CHARACTERS\\\", \\\"params\\\":{\\\"forbiddenChars\\\":join(params.forbiddenChars, \\\", \\\")}}];\\n            }\\n        }\\n    }\\n    return [];\\n}\\n\"}],\"name\":\"userName\"},{\"policyRequirements\":[\"REQUIRED\",\"AT_LEAST_X_CAPITAL_LETTERS\",\"AT_LEAST_X_NUMBERS\",\"MIN_LENGTH\",\"CANNOT_CONTAIN_OTHERS\",\"REAUTH_REQUIRED\"],\"policies\":[{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"not-empty\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    if (value !== undefined && (value === null || !value.length)) {\\n        return [{\\\"policyRequirement\\\":\\\"REQUIRED\\\"}];\\n    } else {\\n        return [];\\n    }\\n}\\n\"},{\"policyRequirements\":[\"AT_LEAST_X_CAPITAL_LETTERS\"],\"params\":{\"numCaps\":1},\"policyId\":\"at-least-X-capitals\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var isRequired = _.find(this.failedPolicyRequirements, function (fpr) {\\n        return fpr.policyRequirement === \\\"REQUIRED\\\";\\n    }), isNonEmptyString = (typeof (value) === \\\"string\\\" && value.length), valuePassesRegexp = (function (v) {\\n        var test = isNonEmptyString ? v.match(/[(A-Z)]/g) : null;\\n        return test !== null && test.length >= params.numCaps;\\n    }(value));\\n    if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {\\n        return [{\\\"policyRequirement\\\":\\\"AT_LEAST_X_CAPITAL_LETTERS\\\", \\\"params\\\":{\\\"numCaps\\\":params.numCaps}}];\\n    }\\n    return [];\\n}\\n\"},{\"policyRequirements\":[\"AT_LEAST_X_NUMBERS\"],\"params\":{\"numNums\":1},\"policyId\":\"at-least-X-numbers\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var isRequired = _.find(this.failedPolicyRequirements, function (fpr) {\\n        return fpr.policyRequirement === \\\"REQUIRED\\\";\\n    }), isNonEmptyString = (typeof (value) === \\\"string\\\" && value.length), valuePassesRegexp = (function (v) {\\n        var test = isNonEmptyString ? v.match(/\\\\d/g) : null;\\n        return test !== null && test.length >= params.numNums;\\n    }(value));\\n    if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {\\n        return [{\\\"policyRequirement\\\":\\\"AT_LEAST_X_NUMBERS\\\", \\\"params\\\":{\\\"numNums\\\":params.numNums}}];\\n    }\\n    return [];\\n}\\n\"},{\"policyRequirements\":[\"MIN_LENGTH\"],\"params\":{\"minLength\":8},\"policyId\":\"minimum-length\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var isRequired = _.find(this.failedPolicyRequirements, function (fpr) {\\n        return fpr.policyRequirement === \\\"REQUIRED\\\";\\n    }), isNonEmptyString = (typeof (value) === \\\"string\\\" && value.length), hasMinLength = isNonEmptyString ? (value.length >= params.minLength) : false;\\n    if ((isRequired || isNonEmptyString) && !hasMinLength) {\\n        return [{\\\"policyRequirement\\\":\\\"MIN_LENGTH\\\", \\\"params\\\":{\\\"minLength\\\":params.minLength}}];\\n    }\\n    return [];\\n}\\n\"},{\"policyRequirements\":[\"CANNOT_CONTAIN_OTHERS\"],\"params\":{\"disallowedFields\":\"userName,givenName,sn\"},\"policyId\":\"cannot-contain-others\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var fieldArray = params.disallowedFields.split(\\\",\\\"), fullObject_server = {}, i;\\n    if (typeof (openidm) !== \\\"undefined\\\" && typeof (request) !== \\\"undefined\\\" && request.resourceName && !request.resourceName.match(\\\"/*$\\\")) {\\n        fullObject_server = openidm.read(request.resourceName);\\n        if (fullObject_server === null) {\\n            fullObject_server = {};\\n        }\\n    }\\n    if (value && typeof (value) === \\\"string\\\" && value.length) {\\n        for (i = 0; i < fieldArray.length; i++) {\\n            if (typeof (fullObject[fieldArray[i]]) === \\\"undefined\\\" && typeof (fullObject_server[fieldArray[i]]) !== \\\"undefined\\\") {\\n                fullObject[fieldArray[i]] = fullObject_server[fieldArray[i]];\\n            }\\n            if (typeof (fullObject[fieldArray[i]]) === \\\"string\\\" && value.match(fullObject[fieldArray[i]])) {\\n                return [{\\\"policyRequirement\\\":\\\"CANNOT_CONTAIN_OTHERS\\\", params:{\\\"disallowedFields\\\":fieldArray[i]}}];\\n            }\\n        }\\n    }\\n    return [];\\n}\\n\"},{\"policyRequirements\":[\"REAUTH_REQUIRED\"],\"policyId\":\"re-auth-required\",\"params\":{\"exceptRoles\":[\"system\",\"openidm-admin\",\"openidm-reg\",\"openidm-cert\"]}}],\"name\":\"password\"},{\"policyRequirements\":[\"REQUIRED\",\"VALID_EMAIL_ADDRESS_FORMAT\"],\"policies\":[{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"required\",\"policyFunction\":\"\\nfunction (fullObject, value, params, propName) {\\n    if (value === undefined) {\\n        return [{\\\"policyRequirement\\\":\\\"REQUIRED\\\"}];\\n    }\\n    return [];\\n}\\n\"},{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"not-empty\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    if (value !== undefined && (value === null || !value.length)) {\\n        return [{\\\"policyRequirement\\\":\\\"REQUIRED\\\"}];\\n    } else {\\n        return [];\\n    }\\n}\\n\"},{\"policyRequirements\":[\"VALID_EMAIL_ADDRESS_FORMAT\"],\"policyId\":\"valid-email-address-format\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var pattern = /^([A-Za-z0-9_\\\\-\\\\.])+\\\\@([A-Za-z0-9_\\\\-\\\\.])+\\\\.([A-Za-z]{2,4})$/, isRequired = _.find(this.failedPolicyRequirements, function (fpr) {\\n        return fpr.policyRequirement === \\\"REQUIRED\\\";\\n    }), isNonEmptyString = (typeof (value) === \\\"string\\\" && value.length), valuePassesRegexp = (function (v) {\\n        var testResult = isNonEmptyString ? pattern.test(v) : false;\\n        return testResult;\\n    }(value));\\n    if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {\\n        return [{\\\"policyRequirement\\\":\\\"VALID_EMAIL_ADDRESS_FORMAT\\\"}];\\n    }\\n    return [];\\n}\\n\"}],\"name\":\"mail\"},{\"policyRequirements\":[\"REQUIRED\",\"VALID_NAME_FORMAT\"],\"policies\":[{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"required\",\"policyFunction\":\"\\nfunction (fullObject, value, params, propName) {\\n    if (value === undefined) {\\n        return [{\\\"policyRequirement\\\":\\\"REQUIRED\\\"}];\\n    }\\n    return [];\\n}\\n\"},{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"not-empty\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    if (value !== undefined && (value === null || !value.length)) {\\n        return [{\\\"policyRequirement\\\":\\\"REQUIRED\\\"}];\\n    } else {\\n        return [];\\n    }\\n}\\n\"},{\"policyRequirements\":[\"VALID_NAME_FORMAT\"],\"policyId\":\"valid-name-format\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var pattern = /^([A-Za'-\\\\u0105\\\\u0107\\\\u0119\\\\u0142\\\\u00F3\\\\u015B\\\\u017C\\\\u017A\\\\u0104\\\\u0106\\\\u0118\\\\u0141\\\\u00D3\\\\u015A\\\\u017B\\\\u0179\\\\u00C0\\\\u00C8\\\\u00CC\\\\u00D2\\\\u00D9\\\\u00E0\\\\u00E8\\\\u00EC\\\\u00F2\\\\u00F9\\\\u00C1\\\\u00C9\\\\u00CD\\\\u00D3\\\\u00DA\\\\u00DD\\\\u00E1\\\\u00E9\\\\u00ED\\\\u00F3\\\\u00FA\\\\u00FD\\\\u00C2\\\\u00CA\\\\u00CE\\\\u00D4\\\\u00DB\\\\u00E2\\\\u00EA\\\\u00EE\\\\u00F4\\\\u00FB\\\\u00C3\\\\u00D1\\\\u00D5\\\\u00E3\\\\u00F1\\\\u00F5\\\\u00C4\\\\u00CB\\\\u00CF\\\\u00D6\\\\u00DC\\\\u0178\\\\u00E4\\\\u00EB\\\\u00EF\\\\u00F6\\\\u00FC\\\\u0178\\\\u00A1\\\\u00BF\\\\u00E7\\\\u00C7\\\\u0152\\\\u0153\\\\u00DF\\\\u00D8\\\\u00F8\\\\u00C5\\\\u00E5\\\\u00C6\\\\u00E6\\\\u00DE\\\\u00FE\\\\u00D0\\\\u00F0\\\\-\\\\s])+$/, isRequired = _.find(this.failedPolicyRequirements, function (fpr) {\\n        return fpr.policyRequirement === \\\"REQUIRED\\\";\\n    }), isNonEmptyString = (typeof (value) === \\\"string\\\" && value.length), valuePassesRegexp = (function (v) {\\n        var testResult = isNonEmptyString ? pattern.test(v) : false;\\n        return testResult;\\n    }(value));\\n    if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {\\n        return [{\\\"policyRequirement\\\":\\\"VALID_NAME_FORMAT\\\"}];\\n    }\\n    return [];\\n}\\n\"}],\"name\":\"givenName\"},{\"policyRequirements\":[\"REQUIRED\",\"VALID_NAME_FORMAT\"],\"policies\":[{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"required\",\"policyFunction\":\"\\nfunction (fullObject, value, params, propName) {\\n    if (value === undefined) {\\n        return [{\\\"policyRequirement\\\":\\\"REQUIRED\\\"}];\\n    }\\n    return [];\\n}\\n\"},{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"not-empty\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    if (value !== undefined && (value === null || !value.length)) {\\n        return [{\\\"policyRequirement\\\":\\\"REQUIRED\\\"}];\\n    } else {\\n        return [];\\n    }\\n}\\n\"},{\"policyRequirements\":[\"VALID_NAME_FORMAT\"],\"policyId\":\"valid-name-format\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var pattern = /^([A-Za'-\\\\u0105\\\\u0107\\\\u0119\\\\u0142\\\\u00F3\\\\u015B\\\\u017C\\\\u017A\\\\u0104\\\\u0106\\\\u0118\\\\u0141\\\\u00D3\\\\u015A\\\\u017B\\\\u0179\\\\u00C0\\\\u00C8\\\\u00CC\\\\u00D2\\\\u00D9\\\\u00E0\\\\u00E8\\\\u00EC\\\\u00F2\\\\u00F9\\\\u00C1\\\\u00C9\\\\u00CD\\\\u00D3\\\\u00DA\\\\u00DD\\\\u00E1\\\\u00E9\\\\u00ED\\\\u00F3\\\\u00FA\\\\u00FD\\\\u00C2\\\\u00CA\\\\u00CE\\\\u00D4\\\\u00DB\\\\u00E2\\\\u00EA\\\\u00EE\\\\u00F4\\\\u00FB\\\\u00C3\\\\u00D1\\\\u00D5\\\\u00E3\\\\u00F1\\\\u00F5\\\\u00C4\\\\u00CB\\\\u00CF\\\\u00D6\\\\u00DC\\\\u0178\\\\u00E4\\\\u00EB\\\\u00EF\\\\u00F6\\\\u00FC\\\\u0178\\\\u00A1\\\\u00BF\\\\u00E7\\\\u00C7\\\\u0152\\\\u0153\\\\u00DF\\\\u00D8\\\\u00F8\\\\u00C5\\\\u00E5\\\\u00C6\\\\u00E6\\\\u00DE\\\\u00FE\\\\u00D0\\\\u00F0\\\\-\\\\s])+$/, isRequired = _.find(this.failedPolicyRequirements, function (fpr) {\\n        return fpr.policyRequirement === \\\"REQUIRED\\\";\\n    }), isNonEmptyString = (typeof (value) === \\\"string\\\" && value.length), valuePassesRegexp = (function (v) {\\n        var testResult = isNonEmptyString ? pattern.test(v) : false;\\n        return testResult;\\n    }(value));\\n    if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {\\n        return [{\\\"policyRequirement\\\":\\\"VALID_NAME_FORMAT\\\"}];\\n    }\\n    return [];\\n}\\n\"}],\"name\":\"sn\"},{\"policyRequirements\":[\"VALID_PHONE_FORMAT\"],\"policies\":[{\"policyRequirements\":[\"VALID_PHONE_FORMAT\"],\"policyId\":\"valid-phone-format\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var pattern = /^\\\\+?([0-9\\\\- \\\\(\\\\)])*$/, isRequired = _.find(this.failedPolicyRequirements, function (fpr) {\\n        return fpr.policyRequirement === \\\"REQUIRED\\\";\\n    }), isNonEmptyString = (typeof (value) === \\\"string\\\" && value.length), valuePassesRegexp = (function (v) {\\n        var testResult = isNonEmptyString ? pattern.test(v) : false;\\n        return testResult;\\n    }(value));\\n    if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {\\n        return [{\\\"policyRequirement\\\":\\\"VALID_PHONE_FORMAT\\\"}];\\n    }\\n    return [];\\n}\\n\"}],\"name\":\"telephoneNumber\"},{\"policyRequirements\":[\"REQUIRED\"],\"policies\":[{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"required-if-configured\",\"params\":{\"baseKey\":\"configuration.securityQuestions\",\"exceptRoles\":[\"system\",\"openidm-admin\"],\"configBase\":\"ui/configuration\"}}],\"name\":\"securityQuestion\"},{\"policyRequirements\":[\"REQUIRED\",\"MIN_LENGTH\",\"REAUTH_REQUIRED\"],\"policies\":[{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"required-if-configured\",\"params\":{\"baseKey\":\"configuration.securityQuestions\",\"exceptRoles\":[\"system\",\"openidm-admin\"],\"configBase\":\"ui/configuration\"}},{\"policyRequirements\":[\"MIN_LENGTH\"],\"params\":{\"minLength\":16},\"policyId\":\"minimum-length\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var isRequired = _.find(this.failedPolicyRequirements, function (fpr) {\\n        return fpr.policyRequirement === \\\"REQUIRED\\\";\\n    }), isNonEmptyString = (typeof (value) === \\\"string\\\" && value.length), hasMinLength = isNonEmptyString ? (value.length >= params.minLength) : false;\\n    if ((isRequired || isNonEmptyString) && !hasMinLength) {\\n        return [{\\\"policyRequirement\\\":\\\"MIN_LENGTH\\\", \\\"params\\\":{\\\"minLength\\\":params.minLength}}];\\n    }\\n    return [];\\n}\\n\"},{\"policyRequirements\":[\"REAUTH_REQUIRED\"],\"policyId\":\"re-auth-required\",\"params\":{\"exceptRoles\":[\"system\",\"openidm-admin\",\"openidm-reg\"]}}],\"name\":\"securityAnswer\"},{\"policyRequirements\":[\"NO_MORE_THAN_X_ATTEMPTS_WITHIN_Y_MINUTES\"],\"policies\":[{\"policyRequirements\":[\"NO_MORE_THAN_X_ATTEMPTS_WITHIN_Y_MINUTES\"],\"policyId\":\"max-attempts-triggers-lock-cooldown\",\"params\":{\"dateTimeField\":\"lastSecurityAnswerAttempt\",\"numMinutes\":15,\"max\":3}}],\"name\":\"securityAnswerAttempts\"},{\"policyRequirements\":[\"VALID_DATE\"],\"policies\":[{\"policyRequirements\":[\"VALID_DATE\"],\"policyId\":\"valid-date\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var isRequired = _.find(this.failedPolicyRequirements, function (fpr) {\\n        return fpr.policyRequirement === \\\"REQUIRED\\\";\\n    }), isNonEmptyString = (typeof (value) === \\\"string\\\" && value.length), isValidDate = isNonEmptyString ? !isNaN(new Date(value).getTime()) : false;\\n    if ((isRequired || isNonEmptyString) && !isValidDate) {\\n        return [{\\\"policyRequirement\\\":\\\"VALID_DATE\\\"}];\\n    }\\n    return [];\\n}\\n\"}],\"name\":\"lastSecurityAnswerAttempt\"},{\"policyRequirements\":[\"MIN_LENGTH\",\"REQUIRED\"],\"policies\":[{\"policyRequirements\":[\"MIN_LENGTH\"],\"params\":{\"minLength\":4},\"policyId\":\"minimum-length\",\"policyFunction\":\"\\nfunction (fullObject, value, params, property) {\\n    var isRequired = _.find(this.failedPolicyRequirements, function (fpr) {\\n        return fpr.policyRequirement === \\\"REQUIRED\\\";\\n    }), isNonEmptyString = (typeof (value) === \\\"string\\\" && value.length), hasMinLength = isNonEmptyString ? (value.length >= params.minLength) : false;\\n    if ((isRequired || isNonEmptyString) && !hasMinLength) {\\n        return [{\\\"policyRequirement\\\":\\\"MIN_LENGTH\\\", \\\"params\\\":{\\\"minLength\\\":params.minLength}}];\\n    }\\n    return [];\\n}\\n\"},{\"policyRequirements\":[\"REQUIRED\"],\"policyId\":\"required-if-configured\",\"params\":{\"baseKey\":\"configuration.siteIdentification\",\"exceptRoles\":[\"system\",\"openidm-admin\"],\"configBase\":\"ui/configuration\"}}],\"name\":\"passPhrase\"}]}"
            ]
        );

        server.respondWith(
            "POST",
            "/openidm/policy/managed/user/19cde185-5712-4514-bcf2-d3103985f24a?_action=validateObject",
            [
                200,
                { },
                "{\"result\":true,\"failedPolicyRequirements\":[]}"
            ]
        );

    };

});
