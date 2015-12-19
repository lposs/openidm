/** 
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2012-2014 ForgeRock AS. All Rights Reserved
 *
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the License). You may not use this file except in
 * compliance with the License.
 *
 * You can obtain a copy of the License at
 * http://forgerock.org/license/CDDLv1.0.html
 * See the License for the specific language governing
 * permission and limitations under the License.
 *
 * When distributing Covered Code, include this CDDL
 * Header Notice in each file and include the License file
 * at http://forgerock.org/license/CDDLv1.0.html
 * If applicable, add the following below the CDDL Header,
 * with the fields enclosed by brackets [] replaced by
 * your own identifying information:
 * "Portions Copyrighted [year] [name of copyright owner]"
 */

var fullResourcePath,
    result,
    enforce;

enforce = identityServer.getProperty("openidm.policy.enforcement.enabled", "true", true);

if (request.resourcePath.indexOf("policy/") !== 0 && enforce !== "false") {
    if (request.method === "create") {
        if (request.resourcePath === "") {
            fullResourcePath = request.newResourceId !== null ? request.newResourceId : "*";
        } else {
            fullResourcePath = request.resourcePath + "/" + (request.newResourceId !== null ? request.newResourceId : "*");
        }
    } else {
        fullResourcePath = request.resourcePath;
    }

    result = openidm.action("policy/" + fullResourcePath, "validateObject", request.content, { "external" : "true" });

    if (!result.result) {
        throw {
            "code" : 403,
            "message" : "Policy validation failed",
            "detail" : result
        };
    }
}


