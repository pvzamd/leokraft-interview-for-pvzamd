<template>
  <!-- <p>
    page no. {{ $store.state.page_no_url }} {{ $store.state.start_date_url }}
    {{ $store.state.end_date_url }} {{ $store.state.launch_status_url }}
  </p> -->
  <!-- <button @click="change_url_ids('563','1','241','59')">baal</button> -->
  <div class="container">
    <div class="row nav_logo">
      <img src="../assets/image/SpaceXLogo.jpg" />
    </div>
    <div class="row filter_options">
      <div class="filter_duration">
        <i class="far fa-calendar"></i>
        <select
          class="form-select form-select-sm"
          @change="duration_filter_display($event)"
        >
          <option value="1" :selected="end_date_url == '1'">All dates</option>
          <option value="2" :selected="end_date_url == '2'">Past Week</option>
          <option value="3" :selected="end_date_url == '3'">Past Month</option>
          <option value="4" :selected="end_date_url == '4'">
            Past 3 Months
          </option>
          <option value="5" :selected="end_date_url == '5'">
            Past 6 Months
          </option>
          <option value="6" :selected="end_date_url == '6'">Past Year</option>
          <option value="7" :selected="end_date_url == '7'">
            Past 2 Years
          </option>
        </select>
      </div>
      <div class="filter_status">
        <i class="fas fa-filter"></i>
        <select
          class="form-select form-select-sm"
          @change="launches_filter_display($event)"
        >
          <option value="1" :selected="launch_status_url == '1'">
            All Launches
          </option>
          <option value="2" :selected="launch_status_url == '2'">
            Upcoming Launches
          </option>
          <option value="3" :selected="launch_status_url == '3'">
            Successful Launches
          </option>
          <option value="4" :selected="launch_status_url == '4'">
            Failed Launches
          </option>
        </select>
      </div>
    </div>
    <div>
      <table class="table table-borderless data_table">
        <thead>
          <tr>
            <th scope="col">No:</th>
            <th scope="col">Launched (UTC)</th>
            <th scope="col">Location</th>
            <th scope="col">Mission</th>
            <th scope="col">Orbit</th>
            <th scope="col" class="status_cell">Launch Status</th>
            <th scope="col">Rocket</th>
          </tr>
        </thead>
        <tbody v-if="loader_display">
          <tr>
            <td height="400" colspan="7" class="no_record">
              <div class="loader"></div>
            </td>
          </tr>
        </tbody>
        <tbody v-if="datalength > 0 && !loader_display">
          <tr
            v-for="(each_launch, i) in all_launches_12['data']"
            :key="i"
            @click="modal_onclick_fn(each_launch)"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            <!-- <div data-bs-toggle="modal" data-bs-target="#staticBackdrop"> -->
            <td scope="row">{{ each_launch.flight_number }}</td>
            <td>{{ date_conversion(each_launch["launch_date_utc"]) }}</td>
            <td>{{ each_launch["launch_site"].site_name }}</td>
            <td>{{ each_launch.mission_name }}</td>
            <td>
              {{ each_launch["rocket"]["second_stage"].payloads[0].orbit }}
            </td>
            <td class="status_cell">
              <div
                :class="{ upcoming_status: each_launch.upcoming == true }"
                v-if="each_launch.upcoming == true"
              >
                <strong>Upcoming</strong>
              </div>
              <div
                :class="{ success_status: each_launch.launch_success == true }"
                v-else-if="each_launch.launch_success == true"
              >
                <strong>Success</strong>
              </div>
              <div
                :class="{ failed_status: each_launch.launch_success == false }"
                v-else-if="each_launch.launch_success == false"
              >
                <strong>Failed</strong>
              </div>
              <div class="unknown_status"
                v-else
              >
                <strong>Unknown</strong>
              </div>
            </td>
            <td>{{ each_launch["rocket"].rocket_name }}</td>
            <!-- </div> -->
          </tr>
        </tbody>
        <tbody v-if="datalength <= 0 && !loader_display">
          <tr>
            <td height="400" colspan="7" class="no_record">
              <div>No results found for the specified filter</div>
            </td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination data_table_pagination">
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          <li
            v-for="(each_page, index) in all_launches_12['total_pages']"
            :key="index"
            class="page-item"
          >
            <a
              class="page-link"
              @click="
                each_page_display(
                  each_page,
                  start_date_url,
                  end_date_url,
                  launch_status_url
                )
              "
              >{{ each_page }}</a
            >
          </li>

          <li class="page-item">
            <a class="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <div
      class="modal fade modal_custom"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body custom_modal_body">
            <div class="custom_modal_head">
              <div class="modal_logo">
                <img :src="single_details.logo_img" />
              </div>
              <div>
                <div>{{ single_details.mission_name }}</div>
                <div v-if="single_details.upcoming == true ">Upcoming</div>
                <div v-else-if="single_details.launch_success == true ">Success</div>
                <div v-else-if="single_details.launch_success == false ">Failed</div>
                <div v-else>Status Unknown</div>
                <div>{{ single_details.rocket_name }}</div>
                <div class="custom_modal_icons">
                  <a :href="single_details.article_link" target="_blank"
                    ><img src="../assets/image/nasa-2.svg"
                  /></a>
                  <a :href="single_details.wikipedia_link" target="_blank"
                    ><i class="fab fa-wikipedia-w" style="font-size: 14px"></i
                  ></a>
                  <a :href="single_details.youtube_link" target="_blank"
                    ><i class="fab fa-youtube" style="font-size: 14px"></i
                  ></a>
                </div>
              </div>
            </div>

            <div class="custom_modal_description">
              {{ single_details.details }}
              <a :href="single_details.wikipedia_link" target="_blank"
                >Wikipedia</a
              >
            </div>

            <div>
              <table class="table table-borderless modal_table">
                <tbody>
                  <tr>
                    <td>Flight Number</td>
                    <td>{{ single_details.flight_number }}</td>
                  </tr>
                  <tr>
                    <td>Mission Name</td>
                    <td>{{ single_details.mission_name }}</td>
                  </tr>
                  <tr>
                    <td>Rocket Type</td>
                    <td>{{ single_details.rocket_type }}</td>
                  </tr>
                  <tr>
                    <td>Rocket Name</td>
                    <td>{{ single_details.rocket_name }}</td>
                  </tr>
                  <tr>
                    <td>Manufacturer</td>
                    <td>{{ single_details.Manufacturer }}</td>
                  </tr>
                  <tr>
                    <td>Nationality</td>
                    <td>{{ single_details.Nationality }}</td>
                  </tr>
                  <!-- <tr><td>Launch Date</td><td>08 October 2012 00:35</td></tr> -->
                  <tr>
                    <td>Launch Date</td>
                    <td>
                      {{ date_conversion(single_details.launch_date_utc) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Payload Type</td>
                    <td>{{ single_details.payload_type }}</td>
                  </tr>
                  <tr>
                    <td>Orbit</td>
                    <td>{{ single_details.orbit }}</td>
                  </tr>
                  <tr>
                    <td>Launch Site</td>
                    <td>{{ single_details.launch_site }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const all_launches_url = "https://api.spacexdata.com/v3/launches";
export default {
  data() {
    return {
      page_no_url: 1,
      start_date_url: "null",
      end_date_url: "null",
      launch_status_url: "null",
      all_launches_array: [],
      filtered_launches_array: [],
      all_launches_12: [],
      single_details: [],
      datalength: 12,
      loader_display: true,
    };
  },
  watch: {
    $route(to, from) {
      if (
        to.params.page_no ||
        to.params.start_date ||
        to.params.end_date ||
        to.params.launch_status
      ) {
        this.$router.go();
      }
    },
  },
  computed: {
    page_no_url_fn() {
      return this.$route.params.page_no;
    },
    start_date_url_fn() {
      return this.$route.params.start_date;
    },
    end_date_url_fn() {
      return this.$route.params.end_date;
    },
    launch_status_url_fn() {
      //console.log(this.$route.params.launch_status);
      return this.$route.params.launch_status;
    },
  },
  mounted() {
    this.initial_fn();
    this.loader_display = true;
    this.all_launches_fn();
  },
  methods: {
    initial_fn() {
      this.page_no_url = this.page_no_url_fn;
      this.$store.commit("store_page_no_url_fn", this.page_no_url);

      this.start_date_url = this.start_date_url_fn;
      this.$store.commit("store_start_date_url_fn", this.start_date_url);

      this.end_date_url = this.end_date_url_fn;
      this.$store.commit("store_end_date_url_fn", this.end_date_url);

      this.launch_status_url = this.launch_status_url_fn;
      this.$store.commit("store_launch_status_url_fn", this.launch_status_url);
    },
    all_launches_fn() {
      axios
        .get(all_launches_url)
        .then((response) => {
          this.all_launches_array = response.data;
          this.filtered_launches_array = response.data;
          //console.log(this.launch_status_url);
          if (
            this.start_date_url == "null" &&
            this.end_date_url == "null" &&
            this.launch_status_url == "null"
          ) {
            this.all_launches_12 = this.paginator(
              this.filtered_launches_array,
              this.page_no_url,
              12
            );
            this.datalength = this.all_launches_12["data"].length;
          } else if (
            this.start_date_url == "null" &&
            this.end_date_url == "null" &&
            this.launch_status_url != "null"
          ) {
            this.filtered_launches_array = [];
            for (var i = 0; i < this.all_launches_array.length; i++) {
              if (this.launch_status_url == "1") {
                this.filtered_launches_array = this.all_launches_array;
              } else if (this.launch_status_url == "2") {
                if (this.all_launches_array[i].upcoming == true) {
                  this.filtered_launches_array.push(this.all_launches_array[i]);
                }
              } else if (this.launch_status_url == "3") {
                if (this.all_launches_array[i].launch_success == true) {
                  this.filtered_launches_array.push(this.all_launches_array[i]);
                }
              } else if (this.launch_status_url == "4") {
                if (this.all_launches_array[i].launch_success == false) {
                  this.filtered_launches_array.push(this.all_launches_array[i]);
                }
              }
            }
            this.all_launches_12 = this.paginator(
              this.filtered_launches_array,
              this.page_no_url,
              12
            );
            this.datalength = this.all_launches_12["data"].length;
          } else if (
            this.start_date_url == "null" &&
            this.end_date_url != "null" &&
            this.launch_status_url == "null"
          ) {
            this.filtered_launches_array = [];
            for (var i = 0; i < this.all_launches_array.length; i++) {
              if (this.end_date_url == "1") {
                this.filtered_launches_array = this.all_launches_array;
              } else {
                if (
                  this.duration_filter(
                    this.all_launches_array[i].launch_date_unix,
                    this.end_date_url
                  ) == true
                ) {
                  this.filtered_launches_array.push(this.all_launches_array[i]);
                }
              }
            }
            this.all_launches_12 = this.paginator(
              this.filtered_launches_array,
              this.page_no_url,
              12
            );
            this.datalength = this.all_launches_12["data"].length;
          } else if (
            this.start_date_url == "null" &&
            this.end_date_url != "null" &&
            this.launch_status_url != "null"
          ) {
            this.filtered_launches_array = [];
            if (this.end_date_url == "1" && this.launch_status_url == "1") {
              this.filtered_launches_array = this.all_launches_array;
            } else if (
              this.end_date_url != "1" &&
              this.launch_status_url == "1"
            ) {
              for (var i = 0; i < this.all_launches_array.length; i++) {
                if (
                  this.duration_filter(
                    this.all_launches_array[i].launch_date_unix,
                    this.end_date_url
                  ) == true
                ) {
                  this.filtered_launches_array.push(this.all_launches_array[i]);
                }
              }
            } else if (
              this.end_date_url != "1" &&
              this.launch_status_url == "2"
            ) {
              for (var i = 0; i < this.all_launches_array.length; i++) {
                if (
                  this.duration_filter(
                    this.all_launches_array[i].launch_date_unix,
                    this.end_date_url
                  ) == true &&
                  this.all_launches_array[i].upcoming == true
                ) {
                  this.filtered_launches_array.push(this.all_launches_array[i]);
                }
              }
            } else if (
              this.end_date_url != "1" &&
              this.launch_status_url == "3"
            ) {
              for (var i = 0; i < this.all_launches_array.length; i++) {
                if (
                  this.duration_filter(
                    this.all_launches_array[i].launch_date_unix,
                    this.end_date_url
                  ) == true &&
                  this.all_launches_array[i].launch_success == true
                ) {
                  this.filtered_launches_array.push(this.all_launches_array[i]);
                }
              }
            } else if (
              this.end_date_url != "1" &&
              this.launch_status_url == "4"
            ) {
              for (var i = 0; i < this.all_launches_array.length; i++) {
                if (
                  this.duration_filter(
                    this.all_launches_array[i].launch_date_unix,
                    this.end_date_url
                  ) == true &&
                  this.all_launches_array[i].launch_success == false
                ) {
                  this.filtered_launches_array.push(this.all_launches_array[i]);
                }
              }
            } else if (
              this.end_date_url == "1" &&
              this.launch_status_url == "2"
            ) {
              for (var i = 0; i < this.all_launches_array.length; i++) {
                if (this.all_launches_array[i].upcoming == true) {
                  this.filtered_launches_array.push(this.all_launches_array[i]);
                }
              }
            } else if (
              this.end_date_url == "1" &&
              this.launch_status_url == "3"
            ) {
              for (var i = 0; i < this.all_launches_array.length; i++) {
                if (this.all_launches_array[i].launch_success == true) {
                  this.filtered_launches_array.push(this.all_launches_array[i]);
                }
              }
            } else if (
              this.end_date_url == "1" &&
              this.launch_status_url == "4"
            ) {
              for (var i = 0; i < this.all_launches_array.length; i++) {
                if (this.all_launches_array[i].launch_success == false) {
                  this.filtered_launches_array.push(this.all_launches_array[i]);
                }
              }
            }
            this.all_launches_12 = this.paginator(
              this.filtered_launches_array,
              this.page_no_url,
              12
            );
            this.datalength = this.all_launches_12["data"].length;
          }

          // console.log("all_launches_12",this.all_launches_12['data'])
          // console.log("all_launches_12_total_pages",this.all_launches_12['total_pages'])
          // console.log("all_launches_array",this.all_launches_array)
          this.loader_display = false;
        })
        .catch((error) => {
          console.log("Error", error);
        });
    },
    duration_filter(date_unix, duration_filter_data) {
      var today = new Date();
      var filtered_date = "";
      if (duration_filter_data == "2") {
        filtered_date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        );
      }
      if (duration_filter_data == "3") {
        filtered_date = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        );
      }
      if (duration_filter_data == "4") {
        filtered_date = new Date(
          today.getFullYear(),
          today.getMonth() - 3,
          today.getDate()
        );
      }
      if (duration_filter_data == "5") {
        filtered_date = new Date(
          today.getFullYear(),
          today.getMonth() - 6,
          today.getDate()
        );
      }
      if (duration_filter_data == "6") {
        filtered_date = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        );
      }
      if (duration_filter_data == "7") {
        filtered_date = new Date(
          today.getFullYear() - 2,
          today.getMonth(),
          today.getDate()
        );
      }

      var check = new Date(filtered_date).getTime() / 1000;
      if (date_unix >= check) {
        return true;
      } else {
        return false;
      }
    },
    paginator(items, current_page, per_page_items) {
      let page = current_page || 1,
        per_page = per_page_items || 12,
        offset = (page - 1) * per_page,
        paginated_items = items.slice(offset).slice(0, per_page_items),
        total_pages = Math.ceil(items.length / per_page);

      return {
        page: page,
        per_page: per_page,
        pre_page: page - 1 ? page - 1 : null,
        next_page: total_pages > page ? page + 1 : null,
        total: items.length,
        total_pages: total_pages,
        data: paginated_items,
      };
    },
    date_conversion(date_value) {
      const month_names = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      var d = new Date(date_value);
      return (
        ("0" + d.getUTCDate()).slice(-2) +
        " " +
        month_names[d.getUTCMonth()] +
        " " +
        d.getUTCFullYear() +
        " " +
        ("0" + d.getUTCHours()).slice(-2) +
        " " +
        ("0" + d.getUTCMinutes()).slice(-2)
      );
    },
    each_page_display(page_no, start_date, end_date, launch_status) {
      var par = {
        page_no: page_no,
        start_date: start_date,
        end_date: end_date,
        launch_status: launch_status,
      };
      this.$router.push({ name: "SpaceX", params: par });
    },
    modal_onclick_fn(data_value) {
      var each_launch_value = data_value;

      var all_details_single = {
        wikipedia_link: each_launch_value["links"].wikipedia,
        youtube_link: each_launch_value["links"].video_link,
        article_link: each_launch_value["links"].article_link,
        rocket_name: each_launch_value["rocket"].rocket_name,
        details: each_launch_value.details,
        launch_success: each_launch_value.launch_success,
        flight_number: each_launch_value.flight_number,
        mission_name: each_launch_value.mission_name,
        rocket_type: each_launch_value["rocket"].rocket_type,
        Manufacturer: "SpaceX",
        Nationality: "SpaceX",
        launch_date_utc: each_launch_value.launch_date_utc,
        payload_type:
          each_launch_value["rocket"]["second_stage"].payloads[0].payload_type,
        orbit: each_launch_value["rocket"]["second_stage"].payloads[0].orbit,
        launch_site: each_launch_value["launch_site"].site_name,
        upcoming: each_launch_value.upcoming,
        logo_img: each_launch_value["links"].mission_patch_small,
      };
      this.single_details = all_details_single;
      //console.log(all_details_single)
    },
    launches_filter_display(event) {
      const val = event.target.value;
      this.each_page_display(1, "null", this.end_date_url, val);
    },
    duration_filter_display(event) {
      const val = event.target.value;
      //console.log('val',val)
      this.each_page_display(1, "null", val, this.launch_status_url);
    },
  },
};
</script>

<style>
</style>