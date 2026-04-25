import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

// ── 타입 ─────────────────────────────────────────────────────

type LessonStatus = "done" | "locked" | "available";

type Lesson = {
  title: string;
  status: LessonStatus;
};

type Unit = {
  id: number;
  title: string;
  tag: string;
  color: string;
  lessons: Lesson[];
};

// ── 더미 데이터 ───────────────────────────────────────────────

const STREAK = 5;
const XP = 320;
const TODAY_DONE = 3;
const TODAY_TOTAL = 5;

const units: Unit[] = [
  {
    id: 1,
    title: "주식 첫걸음",
    tag: "입문",
    color: Colors.green,
    lessons: [
      { title: "주식이 뭔가요?", status: "done" },
      { title: "코스피 vs 코스닥", status: "done" },
      { title: "종목 고르는 법", status: "locked" },
      { title: "매수/매도 타이밍", status: "locked" },
    ],
  },
  {
    id: 2,
    title: "주식 용어 마스터",
    tag: "기초",
    color: Colors.gold,
    lessons: [
      { title: "PBR, PER이 뭔가요?", status: "locked" },
      { title: "RSI, MACD 읽기", status: "locked" },
      { title: "이동평균선", status: "locked" },
    ],
  },
  {
    id: 3,
    title: "차트 분석 입문",
    tag: "중급",
    color: "#8B5CF6",
    lessons: [
      { title: "캔들차트 읽기", status: "locked" },
      { title: "지지선/저항선", status: "locked" },
      { title: "거래량의 의미", status: "locked" },
    ],
  },
  {
    id: 4,
    title: "쉐도잉 실전",
    tag: "고급",
    color: "#FF6B6B",
    lessons: [
      { title: "고수 매매 따라읽기", status: "locked" },
      { title: "2차적 사고란?", status: "locked" },
    ],
  },
];

// ── 서브 컴포넌트 ─────────────────────────────────────────────

function StreakHeader() {
  return (
    <View style={styles.streakHeader}>
      {/* 스트릭 */}
      <View style={styles.streakItem}>
        <Ionicons name="flame" size={20} color="#FF6B35" />
        <Text style={styles.streakValue}>{STREAK}</Text>
        <Text style={styles.streakLabel}>일 연속</Text>
      </View>

      <View style={styles.logoWrap}>
        <Text style={styles.logoText}>따투 학습</Text>
      </View>

      {/* XP */}
      <View style={styles.streakItem}>
        <Ionicons name="flash" size={20} color={Colors.gold} />
        <Text style={styles.streakValue}>{XP}</Text>
        <Text style={styles.streakLabel}>XP</Text>
      </View>
    </View>
  );
}

function TodayProgressBanner() {
  const progress = TODAY_DONE / TODAY_TOTAL;
  const remaining = TODAY_TOTAL - TODAY_DONE;

  return (
    <View style={styles.todayBanner}>
      <View style={styles.todayTop}>
        <View style={styles.todayIconWrap}>
          <Ionicons name="reader-outline" size={24} color={Colors.green} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.todayTitle}>
            오늘 학습 완료까지 {remaining}개 남았어요!
          </Text>
          <Text style={styles.todaySub}>{TODAY_DONE}/{TODAY_TOTAL} 완료</Text>
        </View>
        <Text style={styles.todayPercent}>{Math.round(progress * 100)}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>
    </View>
  );
}

function LessonRow({ lesson, index }: { lesson: Lesson; index: number }) {
  const isDone = lesson.status === "done";
  const isLocked = lesson.status === "locked";

  const handlePress = () => {
    if (isLocked) {
      Alert.alert("잠긴 레슨", "이전 레슨을 먼저 완료해야 열려요!");
    } else {
      Alert.alert("학습 시작!", `"${lesson.title}" 레슨을 시작할게요!`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.lessonRow, isLocked && styles.lessonRowLocked]}
    >
      {/* 아이콘 */}
      <View
        style={[
          styles.lessonIcon,
          isDone && styles.lessonIconDone,
          isLocked && styles.lessonIconLocked,
        ]}
      >
        {isDone ? (
          <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
        ) : isLocked ? (
          <Ionicons name="lock-closed" size={16} color={Colors.gray500} />
        ) : (
          <Ionicons name="play-circle" size={20} color={Colors.green} />
        )}
      </View>

      {/* 텍스트 */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.lessonTitle, isLocked && styles.lessonTitleLocked]}>
          레슨 {index + 1}. {lesson.title}
        </Text>
      </View>

      {/* 상태 뱃지 */}
      {isDone && (
        <View style={styles.doneBadge}>
          <Text style={styles.doneBadgeText}>완료</Text>
        </View>
      )}
      {isLocked && (
        <View style={styles.lockedBadge}>
          <Text style={styles.lockedBadgeText}>잠김</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function UnitCard({ unit }: { unit: Unit }) {
  const doneCount = unit.lessons.filter((l) => l.status === "done").length;
  const total = unit.lessons.length;
  const progress = doneCount / total;

  return (
    <View style={styles.unitCard}>
      <View style={styles.unitHeader}>
        <View style={[styles.unitNumBadge, { backgroundColor: unit.color + "18" }]}>
          <Text style={[styles.unitNumText, { color: unit.color }]}>UNIT {unit.id}</Text>
        </View>
        <Text style={[styles.unitTag, { color: unit.color }]}>{unit.tag}</Text>
      </View>

      <Text style={styles.unitTitle}>{unit.title}</Text>

      <View style={styles.unitProgressRow}>
        <View style={styles.unitProgressTrack}>
          <View
            style={[
              styles.unitProgressFill,
              { width: `${progress * 100}%` as any, backgroundColor: unit.color },
            ]}
          />
        </View>
        <Text style={styles.unitProgressLabel}>{doneCount}/{total}</Text>
      </View>

      <View style={styles.lessonList}>
        {unit.lessons.map((lesson, i) => (
          <LessonRow key={i} lesson={lesson} index={i} />
        ))}
      </View>
    </View>
  );
}

function QuizBanner() {
  return (
    <View style={styles.quizBanner}>
      <View style={styles.quizLeft}>
        <View style={styles.quizIconWrap}>
          <Ionicons name="bulb" size={24} color={Colors.green} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.quizTitle}>오늘의 용어 퀴즈</Text>
          <Text style={styles.quizQuestion}>PER이 낮을수록 좋은 걸까요?</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            "퀴즈",
            "PER이 낮을수록 주가가 저평가됐다는 신호일 수 있어요!\n\n단, 업종 평균과 비교하는 게 중요해요."
          )
        }
        activeOpacity={0.8}
        style={styles.quizBtn}
      >
        <Text style={styles.quizBtnText}>풀기</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── 메인 화면 ─────────────────────────────────────────────────

export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StreakHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TodayProgressBanner />
        <QuizBanner />

        <View style={styles.curriculumHeader}>
          <Text style={styles.curriculumTitle}>학습 커리큘럼</Text>
          <Text style={styles.curriculumSub}>4개 유닛 · 12개 레슨</Text>
        </View>

        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── 스타일 ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  scrollContent: { paddingBottom: 24 },

  // 스트릭 헤더
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  streakItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  streakValue: { color: Colors.text, fontSize: 16, fontWeight: "700" },
  streakLabel: { color: Colors.gray500, fontSize: 12 },
  logoWrap: { flex: 1, alignItems: "center" },
  logoText: { color: Colors.navy, fontSize: 17, fontWeight: "800" },

  // 오늘의 진행 배너
  todayBanner: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  todayTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  todayIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.green + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  todayTitle: { color: Colors.text, fontSize: 14, fontWeight: "700", marginBottom: 2 },
  todaySub: { color: Colors.gray500, fontSize: 12 },
  todayPercent: { color: Colors.green, fontSize: 18, fontWeight: "800" },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.gray100,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: Colors.green, borderRadius: 4 },

  // 퀴즈 배너
  quizBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.navy,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quizLeft: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 12 },
  quizIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.green + "25",
    alignItems: "center",
    justifyContent: "center",
  },
  quizTitle: { color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: "600", marginBottom: 3 },
  quizQuestion: { color: Colors.white, fontSize: 14, fontWeight: "700", lineHeight: 20 },
  quizBtn: {
    backgroundColor: Colors.green,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  quizBtnText: { color: Colors.white, fontSize: 13, fontWeight: "700" },

  // 커리큘럼 헤더
  curriculumHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  curriculumTitle: { color: Colors.navy, fontSize: 16, fontWeight: "700" },
  curriculumSub: { color: Colors.gray500, fontSize: 12 },

  // 유닛 카드
  unitCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  unitHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  unitNumBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  unitNumText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  unitTag: { fontSize: 12, fontWeight: "600" },
  unitTitle: { color: Colors.text, fontSize: 16, fontWeight: "700", marginBottom: 10 },
  unitProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  unitProgressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.gray100,
    borderRadius: 3,
    overflow: "hidden",
  },
  unitProgressFill: { height: "100%", borderRadius: 3 },
  unitProgressLabel: {
    color: Colors.gray500,
    fontSize: 12,
    fontWeight: "600",
    minWidth: 28,
    textAlign: "right",
  },

  // 레슨 행
  lessonList: { gap: 8 },
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 12,
  },
  lessonRowLocked: { opacity: 0.55 },
  lessonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.green + "15",
  },
  lessonIconDone: { backgroundColor: Colors.green },
  lessonIconLocked: { backgroundColor: Colors.gray100 },
  lessonTitle: { color: Colors.text, fontSize: 14, fontWeight: "500" },
  lessonTitleLocked: { color: Colors.gray500 },
  doneBadge: {
    backgroundColor: Colors.green + "18",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  doneBadgeText: { color: Colors.green, fontSize: 11, fontWeight: "700" },
  lockedBadge: {
    backgroundColor: Colors.gray100,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  lockedBadgeText: { color: Colors.gray500, fontSize: 11, fontWeight: "600" },
});
