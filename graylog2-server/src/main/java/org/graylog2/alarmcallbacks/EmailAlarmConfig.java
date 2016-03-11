/**
 * This file is part of Graylog.
 *
 * Graylog is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.graylog2.alarmcallbacks;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.Range;

import javax.annotation.Nullable;
import java.net.URI;

import static com.google.common.base.MoreObjects.firstNonNull;

@AutoValue
@JsonAutoDetect
public abstract class EmailAlarmConfig {
    @JsonProperty("enabled")
    public abstract boolean enabled();

    @JsonProperty("hostname")
    public abstract String hostname();

    @JsonProperty("port")
    public abstract int port();

    @JsonProperty("use_auth")
    public abstract boolean useAuth();

    @JsonProperty("use_tls")
    public abstract boolean useTls();

    @JsonProperty("use_ssl")
    public abstract boolean useSsl();

    @JsonProperty("auth_username")
    @Nullable
    public abstract String username();

    @JsonProperty("auth_password")
    @Nullable
    public abstract String password();

    @JsonProperty("subject_prefix")
    @Nullable
    public abstract String subjectPrefix();

    @JsonProperty("from_email")
    public abstract String fromEmail();

    @JsonProperty("web_interface_url")
    @Nullable
    public abstract URI webInterfaceUri();

    @JsonCreator
    public static EmailAlarmConfig create(@JsonProperty("enabled") boolean enabled,
                                          @JsonProperty("hostname") @NotBlank String hostname,
                                          @JsonProperty("port") @Range(min = 1L, max = 65535L) Integer port,
                                          @JsonProperty("use_auth") boolean useAuth,
                                          @JsonProperty("use_tls") boolean useTls,
                                          @JsonProperty("use_ssl") boolean useSsl,
                                          @JsonProperty("auth_username") @Nullable String username,
                                          @JsonProperty("auth_password") @Nullable String password,
                                          @JsonProperty("subject_prefix") @Nullable String subjectPrefix,
                                          @JsonProperty("from_email") String fromEmail,
                                          @JsonProperty("web_interface_url") @Nullable URI webInterfaceUri) {
        return new AutoValue_EmailAlarmConfig(
            enabled,
            hostname,
            firstNonNull(port, 25),
            useAuth,
            useTls,
            useSsl,
            username,
            password,
            subjectPrefix,
            fromEmail,
            webInterfaceUri);
    }

    public static EmailAlarmConfig defaultConfig() {
        return create(false, "", 25, false, false, false, "", "", "", "", null);
    }
}
