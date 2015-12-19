/*
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
package org.forgerock.openidm.maintenance.upgrade;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.PosixFilePermission;
import java.util.EnumSet;
import java.util.Set;

import org.forgerock.util.Function;

/**
 * Updates / replaces / adds a new static file in the distribution.
 */
class StaticFileUpdate {

    static final String NEW_SUFFIX = ".new-";
    static final String OLD_SUFFIX = ".old-";

    private final FileStateChecker fileStateChecker;
    private final Path root;
    private final Archive archive;
    private final ProductVersion currentVersion;
    private final ProductVersion upgradedVersion;
    private final long timestamp;

    StaticFileUpdate(final FileStateChecker fileStateChecker, final Path openidmRoot, final Archive archive,
            final ProductVersion currentVersion, final long timestamp) {
        this.fileStateChecker = fileStateChecker;
        this.root = openidmRoot;
        this.archive = archive;
        this.currentVersion = currentVersion;
        this.upgradedVersion = archive.getVersion();
        this.timestamp = timestamp;
    }

    /**
     * Table of what to do under what FileState circumstances.
     *
     *                     replace                 keep
     *                       old    / new       old / new
     *
     * UNEXPECTED     rename-as-old / copy          / rename-as-new
     * NONEXISTENT                    copy          / copy
     * DELETED                        copy          / copy
     * DIFFERS        rename-as-old / copy          / rename-as-new
     * UNCHANGED                      copy          / copy
     */

    private static final Set<FileState> CHANGED_STATES = EnumSet.of(FileState.UNEXPECTED, FileState.DIFFERS);

    /**
     * Replaces this static file with the new one from the archive.  If the file has been changed, copy it to
     * <em>&lt;filepath&gt;-.old-version</em>.  Supports copying fresh file for one that is missing.
     *
     * @param path the path to replace/copy
     * @throws IOException
     */
    Path replace(final Path path) throws IOException {
        Path destination = null;
        Set<PosixFilePermission> permissions = null;
        try {
            permissions = Files.getPosixFilePermissions(path);
            if (CHANGED_STATES.contains(fileStateChecker.getCurrentFileState(path))) {
                destination = root.resolve(path.toString() + OLD_SUFFIX + timestamp);
                Files.move(root.resolve(path),
                        destination,
                        StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (NoSuchFileException e) {
            // this is ok, just install the new file
        }

        final Set<PosixFilePermission> perms = permissions;
        archive.withInputStreamForPath(path, new Function<InputStream, Void, IOException>() {
            @Override
            public Void apply(InputStream inputStream) throws IOException {
                Files.copy(inputStream, root.resolve(path), StandardCopyOption.REPLACE_EXISTING);
                if (perms != null) {
                    Files.setPosixFilePermissions(path, perms);
                }
                return null;
            }
        });

        fileStateChecker.updateState(path);

        return destination;
    }

    /**
     * Keep the static file that already exists.  Install the new file as <em>&lt;filepath&gt;-.new-version</em>.
     *
     * @param path the path to keep/copy
     * @throws IOException
     */
    Path keep(final Path path) throws IOException {
        if (CHANGED_STATES.contains(fileStateChecker.getCurrentFileState(path))) {
            final Path destination = root.resolve(path.toString() + NEW_SUFFIX + timestamp);
            archive.withInputStreamForPath(path, new Function<InputStream, Void, IOException>() {
                @Override
                public Void apply(InputStream inputStream) throws IOException {
                    Files.copy(inputStream,
                            destination,
                            StandardCopyOption.REPLACE_EXISTING);
                    return null;
                }
            });

            fileStateChecker.updateState(path);

            return destination;
        }
        return null;
    }
}
