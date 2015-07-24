package integration.dashboards;

import com.jayway.restassured.http.ContentType;
import com.jayway.restassured.path.json.JsonPath;
import integration.BaseRestTest;
import integration.MongoDbSeed;
import integration.RequiresAuthentication;
import integration.RequiresVersion;
import org.assertj.core.data.MapEntry;
import org.junit.Test;

import java.util.List;
import java.util.Map;

import static com.jayway.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@RequiresAuthentication
@RequiresVersion(">=1.1.0")
@MongoDbSeed
public class DashboardWidgetsTest extends BaseRestTest {
    private static final String dashboardId = "55784ee43b0ca6697d0da555";
    private static final String baseUri = "/dashboards/" + dashboardId + "/widgets";

    @Test
    public void createFirstWidget() throws Exception {
        final int beforeCount = getDashboardWidgetCount(dashboardId);

        final JsonPath response = given()
                .when()
                .body(jsonResourceForMethod())
                .post(baseUri)
                .then()
                .statusCode(201)
                .assertThat()
                .body(".", containsAllKeys("widget_id"))
                .extract().jsonPath();

        final String widgetId = response.getString("widget_id");
        assertThat(widgetId).isNotEmpty();

        final int afterCount = getDashboardWidgetCount(dashboardId);
        assertThat(afterCount).isGreaterThan(beforeCount);

        final List<Map<String, Object>> dashboardWidgets = getDashboardWidgets(dashboardId);

        System.out.println(dashboardWidgets);
        assertThat(dashboardWidgets).isNotEmpty().hasSize(1);
        assertThat(dashboardWidgets.get(0))
                .contains(MapEntry.entry("description", "Search histogram"))
                .contains(MapEntry.entry("type", "search_result_chart"))
                .contains(MapEntry.entry("cache_time", 10))
                .contains(MapEntry.entry("id", widgetId));
    }

    private List<Map<String, Object>> getDashboardWidgets(String dashboardId) {
        final JsonPath response = given()
                .when()
                .get("/dashboards/" + dashboardId)
                .then()
                .contentType(ContentType.JSON)
                .assertThat()
                .statusCode(200)
                .body(".", containsAllKeys("title", "description", "creator_user_id", "created_at", "positions", "id", "widgets"))
                .extract().jsonPath();

        return response.getList("widgets");
    }

    private int getDashboardWidgetCount(String dashboardId) {
        return getDashboardWidgets(dashboardId).size();
    }
}
