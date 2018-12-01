export class Flags {
  adc_initialized: boolean;
  dac_initialized: boolean;
  dma_initialized: boolean;
  flash_ssp_initialized: boolean;
  i2c0_initialized: boolean;
  i2c1_initialized: boolean;
  i2c2_initialized: boolean;
  uart0_initialized: boolean;
  uart1_initialized: boolean;
  uart2_initialized: boolean;
  uart3_initialized: boolean;
  rtc_initialized: boolean;
  ssp1_initialized: boolean;
  structs_initialized: boolean;
  systick_initialized: boolean;
  timer1_initialized: boolean;
  watchdog_initialized: boolean;
  eeprom_initialized: boolean;
  ars_initialized: boolean;
  power_management_initialized: boolean;
  flash_initialized: boolean;
  seven_segment_intern_initialized: boolean;
  seven_segment_extern_initialized: boolean;
  startup_success: boolean;
  sensor_pressure_initialized: boolean;
  startup_checked: boolean;
  sensor_imu_initialized: boolean;
  sensor_tmp100_initialized: boolean;
  sensor_hig_initialized: boolean;
  sensor_gyro_initialized: boolean;
  gnss_initialized: boolean;
  servo_initialized_all: boolean;
  pwm_initialized: boolean;
  afs_initialized: boolean;
  camera_initialized: boolean;
  sensor_current_initialized: boolean;
  igniter_initialized: boolean;
  separation_detection_initialized: boolean;
  servo_configured: boolean;
  igniter_configured: boolean;
  igniter_1_fired: boolean;
  igniter_2_fired: boolean;
  igniter_3_fired: boolean;
  igniter_4_fired: boolean;
  igniter_1_firing: boolean;
  igniter_2_firing: boolean;
  igniter_3_firing: boolean;
  igniter_4_firing: boolean;
  igniter_armed: boolean;
  igniter_1_connected: boolean;
  igniter_2_connected: boolean;
  igniter_3_connected: boolean;
  igniter_4_connected: boolean;
  ars_enabled: boolean;
  camera_on: boolean;
  gnss_powersave: boolean;
  flash_erased: boolean;
  flash_store_data: boolean;
  radio_on: boolean;
  radio_tx_active: boolean;
  flash_flight_header_written: boolean;
  timer1_running: boolean;
  rtc_synchronized: boolean;
  usb_connection_detected: boolean;
  watchdog_timeout_occured: boolean;
  flash_full: boolean;
  crystal_oszillator_used: boolean;
  liftoff_detected: boolean;
  gnss_fix: boolean;
  rocket_panic: boolean;
  mainchute_altitude_detected: boolean;
  eagle_landed: boolean;
  rocket_is_stable: boolean;
  apogee_detected_by_kalman: boolean;
  recovery_mode: boolean;
  check_stability_executed: boolean;
  config_intialized: boolean;
  stages_separated: boolean;
  igniter_hpower_fired: boolean;
  igniter_hpower_firing: boolean;
  igniter_hpower_connected: boolean;
  reset_during_flight: boolean;
  housekeeping_data_read: boolean;
  mbb_satcom_configured: boolean;
  mbb_satcom_initialized: boolean;
  mbb_cameras_configured: boolean;
  mbb_cameras_initialized: boolean;
  power_management_operational: boolean;
  rail_5v_enabled: boolean;
  padding1: boolean;
  padding2: boolean;
  battery_overvoltage: boolean;
  battery_only_attached: boolean;
  rail_3v3_sensor_enabled: boolean;
  rail_3v3_gnss_enabled: boolean;
  rail_3v3_external_enabled: boolean;
  cmd_buffer_overrun: boolean;
  eeprom_page_cycle_overflow: boolean;
  flash_dma_buffer_overrun: boolean;
  flash_write_error: boolean;
  i2c_job_buffer_overflow: boolean;
  i2c_interrupt_handler_error: boolean;
  interrupt_interference: boolean;
  uart0_tx_buffer_overflow: boolean;
  uart0_rx_buffer_overflow: boolean;
  uart1_tx_buffer_overflow: boolean;
  uart1_rx_buffer_overflow: boolean;
  uart2_tx_buffer_overflow: boolean;
  uart2_rx_buffer_overflow: boolean;
  uart3_tx_buffer_overflow: boolean;
  uart3_rx_buffer_overflow: boolean;
  ssp1_interrupt_ror: boolean;
  ssp1_interrupt_unknown_device: boolean;
  ssp1_buffer_overflow: boolean;
  watchdog_interrupt_handler_hit: boolean;
  flight_substate_default_handler_hit: boolean;
  rocket_state_default_handler_hit: boolean;
  struct_size_overflows_uart_buffer: boolean;
  config_from_eeprom: boolean;
  event_actions_from_eeprom: boolean;
  brown_out_warning_level_interrupt_hit: boolean;
  lora_overtemperature: boolean;
  lora_critical_temperature: boolean;
  mbb_satcom_running: boolean;
  mbb_cameras_running: boolean;
  development_mode: boolean;
  servo_sweep_in_progress: boolean;
  powerdown_desired: boolean;
}
