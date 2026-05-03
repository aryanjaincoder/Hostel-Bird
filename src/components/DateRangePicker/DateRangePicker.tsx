import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import CalendarPicker from 'react-native-calendar-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './DateRangePicker.styles';

interface Props {
  checkIn: string;
  checkOut: string;
  onDatesSelected: (checkIn: string, checkOut: string) => void;
}

function DateRangePicker({ checkIn, checkOut, onDatesSelected }: Props) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStart, setSelectedStart] = useState<any>(null);
  const [selectedEnd, setSelectedEnd] = useState<any>(null);
  const [activeField, setActiveField] = useState<'checkin' | 'checkout' | null>(null);
  const [calendarKey, setCalendarKey] = useState(0);

  const handleDateChange = (date: any) => {
    if (date == null) return;

    const dateStr = date?.toString();

    if (selectedStart && selectedEnd && dateStr === selectedEnd?.toString()) {
      setSelectedStart(null);
      setSelectedEnd(null);
      setActiveField('checkin');
      setCalendarKey(prev => prev + 1);
      return;
    }

    if (selectedStart && !selectedEnd && dateStr === selectedStart?.toString()) {
      setSelectedStart(null);
      setSelectedEnd(null);
      setActiveField('checkin');
      setCalendarKey(prev => prev + 1);
      return;
    }

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date);
      setSelectedEnd(null);
      setActiveField('checkout');
    } else {
      if (date > selectedStart) {
        setSelectedEnd(date);
        setActiveField('checkout');
      } else {
        setSelectedStart(date);
        setSelectedEnd(null);
        setActiveField('checkout');
      }
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'Select date';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleReset = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
    setActiveField('checkin');
    setCalendarKey(prev => prev + 1);
  };

  const handleConfirm = () => {
    if (selectedStart && selectedEnd) {
      onDatesSelected(formatDate(selectedStart), formatDate(selectedEnd));
      setShowCalendar(false);
    }
  };

  const getHintText = () => {
    if (selectedStart && selectedEnd) {
      return `${formatDate(selectedStart)}  →  ${formatDate(selectedEnd)}`;
    }
    if (selectedStart && !selectedEnd) {
      return 'Now select Check-out date';
    }
    return activeField === 'checkout'
      ? 'Select Check-out date'
      : 'Select Check-in date';
  };

  const bothSelected = selectedStart && selectedEnd;

  return (
    <>
      <View style={styles.dateRow}>
        <View style={styles.dateBox}>
          <Text style={styles.label}>Check in</Text>
          <TouchableOpacity
            style={[
              styles.inputBox,
              activeField === 'checkin' && showCalendar && styles.inputBoxActive,
            ]}
            onPress={() => {
              setActiveField('checkin');
              setSelectedEnd(null);
              setShowCalendar(true);
            }}
          >
            <Icon name="calendar-today" size={18} color="#555" style={styles.iconSpacing} />
            <Text style={[styles.dateText, selectedStart && styles.dateTextActive]}>
              {selectedStart ? formatDate(selectedStart) : 'Select date'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateBox}>
          <Text style={styles.label}>Check out</Text>
          <TouchableOpacity
            style={[
              styles.inputBox,
              activeField === 'checkout' && showCalendar && styles.inputBoxActive,
            ]}
            onPress={() => {
              setActiveField('checkout');
              setShowCalendar(true);
            }}
          >
            <Icon name="calendar-today" size={18} color="#555" style={styles.iconSpacing} />
            <Text style={[styles.dateText, selectedEnd && styles.dateTextActive]}>
              {selectedEnd ? formatDate(selectedEnd) : 'Select date'}
            </Text>
          </TouchableOpacity>

          {bothSelected && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Icon name="info-outline" size={11} color="#E8445A" />
              <Text style={{ fontSize: 10, color: '#E8445A', marginLeft: 3, fontWeight: '500' }}>
                Tap again to reset
              </Text>
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={showCalendar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCalendar(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Dates</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Icon name="close" size={22} color="#555" />
              </TouchableOpacity>
            </View>

            <Text style={styles.hint}>{getHintText()}</Text>

            <CalendarPicker
              key={calendarKey}
              allowRangeSelection
              onDateChange={handleDateChange}
              selectedDayColor="#E8445A"
              selectedDayTextColor="#fff"
              todayBackgroundColor="#fff0f2"
              todayTextStyle={{ color: '#E8445A' }}
              minDate={
                activeField === 'checkout' && selectedStart
                  ? selectedStart
                  : new Date()
              }
              weekdays={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
              months={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
              previousTitle="‹"
              nextTitle="›"
              selectedRangeStyle={{ backgroundColor: '#fff0f2' }}
              selectedRangeStartStyle={{ backgroundColor: '#E8445A' }}
              selectedRangeEndStyle={{ backgroundColor: '#E8445A' }}
              width={320}
            />

            {/* Reset + Done bottom row */}
            <View style={styles.bottomRow}>
              <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.doneBtn, (!selectedStart || !selectedEnd) && styles.doneBtnDisabled]}
                onPress={handleConfirm}
                disabled={!selectedStart || !selectedEnd}
              >
                <Text style={styles.doneText}>
                  {!selectedStart
                    ? 'Select Check-in'
                    : !selectedEnd
                    ? 'Select Check-out'
                    : 'Done ✓'}
                </Text>
              </TouchableOpacity>
            </View>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default DateRangePicker;