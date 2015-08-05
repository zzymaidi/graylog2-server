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
package integration.dashboards;

import com.jayway.restassured.http.ContentType;
import com.jayway.restassured.path.json.JsonPath;
import com.jayway.restassured.response.ValidatableResponse;
import integration.BaseRestTest;
import integration.MongoDbSeed;
import integration.RequiresAuthentication;
import integration.RequiresVersion;
import org.joda.time.DateTime;
import org.junit.Test;

import static com.jayway.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@RequiresAuthentication
@RequiresVersion(">=1.1.0")
@MongoDbSeed
public class DashboardsTest extends BaseRestTest {
    private static final String baseUrl = "/dashboards";

    @Test
    public void listingDashboardsWhenEmpty() throws Exception {
        final JsonPath response = given()
                .when()
                    .get(baseUrl)
                .then()
                    .statusCode(200)
                    .assertThat()
                        .body(".", containsAllKeys("total", "dashboards"))
                    .extract().jsonPath();

        assertThat(response.getInt("total")).isEqualTo(0);
        assertThat(response.getList("dashboards")).isEmpty();
    }

    @Test
    @MongoDbSeed(locations = "twoSimpleDashboards")
    public void listDashboardsShouldReturnTwoDashboards() throws Exception {
        final JsonPath response = given()
                .when()
                .get(baseUrl)
                .then()
                .statusCode(200)
                .assertThat()
                .body(".", containsAllKeys("total", "dashboards"))
                .extract().jsonPath();

        assertThat(response.getInt("total")).isEqualTo(2);
        assertThat(response.getList("dashboards")).isNotEmpty();
    }

    @Test
    public void createFirstDashboard() throws Exception {
        final int beforeCount = getDashboardCount();

        final JsonPath response = createEntityFromRequest(baseUrl, jsonResourceForMethod())
                .statusCode(201)
                .assertThat()
                .body(".", containsAllKeys("dashboard_id"))
                .extract().jsonPath();
        final String dashboardId = response.getString("dashboard_id");
        assertThat(dashboardId).isNotEmpty();

        final int afterCount = getDashboardCount();

        assertThat(afterCount).isGreaterThan(beforeCount);

        final JsonPath getResponse = getDashboard(dashboardId).extract().jsonPath();

        assertThat(getResponse.getString("id")).isEqualTo(dashboardId);
        assertThat(getResponse.getString("title")).isEqualTo("Simple Dashboard");
        assertThat(getResponse.getString("description")).isEqualTo("A Very Simple Dashboard");
        assertThat(getResponse.getString("creator_user_id")).isEqualTo("admin");
        org.assertj.jodatime.api.Assertions.assertThat(DateTime.parse(getResponse.getString("created_at")))
                .isNotNull()
                .isEqualToIgnoringSeconds(DateTime.now());
        assertThat(getResponse.getMap("positions")).isEmpty();
        assertThat(getResponse.getList("widgets")).isEmpty();
    }

    @Test
    @MongoDbSeed(locations = "twoSimpleDashboards")
    public void updateSimpleDashboard() throws Exception {
        final int beforeCount = getDashboardCount();
        final String dashboardId = "55784ee43b0ca6697d0da555";
        final String otherDashboardId = "5592c318fbeafefafa471f58";

        given()
                .when()
                .body(jsonResourceForMethod())
                .put(baseUrl + "/" + dashboardId)
                .then()
                .statusCode(204);

        final int afterCount = getDashboardCount();

        final JsonPath dashboard = getDashboard(dashboardId).extract().jsonPath();
        final JsonPath otherDashboard = getDashboard(otherDashboardId).extract().jsonPath();

        assertThat(afterCount).isEqualTo(beforeCount);
        assertThat(dashboard.getString("title")).isEqualTo("New Name");
        assertThat(otherDashboard.getString("title")).isEqualTo("Test");
        assertThat(dashboard.getString("description")).isEqualTo("Very new description");
        assertThat(otherDashboard.getString("description")).isEqualTo("test");
    }

    @Test
    @MongoDbSeed(locations = "twoSimpleDashboards")
    public void deleteDashboard() throws Exception {
        final String dashboardId = "5592c318fbeafefafa471f58";
        final int beforeCount = getDashboardCount();

        given()
                .when()
                .delete(baseUrl + "/" + dashboardId)
                .then()
                .statusCode(200);

        final int afterCount = getDashboardCount();

        assertThat(afterCount).isLessThan(beforeCount);
    }

    @Test
    @MongoDbSeed(locations = "twoSimpleDashboards")
    public void deleteNonexistingDashboardShouldFail() throws Exception {
        final String dashboardId = "5592c318fbeafefafa471f57";
        final int beforeCount = getDashboardCount();

        given()
                .when()
                .delete(baseUrl + "/" + dashboardId)
                .then()
                .statusCode(404);

        final int afterCount = getDashboardCount();

        assertThat(afterCount).isEqualTo(beforeCount);
    }

    private int getDashboardCount() {
        final JsonPath response = given()
                .when()
                .get(baseUrl)
                .then()
                .statusCode(200)
                .assertThat()
                .body(".", containsAllKeys("total", "dashboards"))
                .extract().jsonPath();

        return response.getInt("total");
    }

    private ValidatableResponse getDashboard(String id) {
        return given()
                .when()
                .get(baseUrl + "/" + id)
                .then()
                .contentType(ContentType.JSON)
                .assertThat()
                .statusCode(200)
                .body(".", containsAllKeys("title", "description", "creator_user_id", "created_at", "positions", "id", "widgets"));
    }
}
